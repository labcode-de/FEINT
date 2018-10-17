const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;
const MongoClient = mongo.MongoClient;
const dbURL = "mongodb://db:27017";
const dbName = "labcodeKBB";
const multer = require('multer');
const sha256 = require('crypto-js/sha256');
const path = require('path');
const passport  = require('passport');

function genString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '/public/bonImages'))
        },
        filename: (req, file, cb) => {
            let customFileName = sha256(file.originalname.split('.')[0] + genString()),
                fileExtension = file.originalname.split('.')[1] // get file extension from original file name
            cb(null, customFileName + '.' + fileExtension)
        }
    })
});
// const basicAuth = require('express-basic-auth')
//
// server.use(basicAuth({
//     users: { 'toskana': '2018' }
// }))
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cors());
server.use(express.static('public'));
let mongoWriteable = true;
MongoClient.connect(dbURL, (err, mongoClient) => {
    if (err) throw err;
    const db = mongoClient.db(dbName);

    server.get('', (req, res) => {
        res.send('Hey there Alpakas!');
    });

    server.post('/control', (req, res) => {
        const rb = req.body;
        if (rb.familien !== undefined) {
            db.collection('settings').insert({"abschlussBerechnet" : false});
            db.collection('familien').deleteMany({}, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("db delete error " + err)
                } else {
                    db.collection('familien').insert(rb.familien).then(() => {
                        res.send('OK')
                    });
                }
            })
        } else {
            res.status(400).send('Bad Request');
        }
    });

    server.post('/addKassenbon', upload.single("kassenbon"), (req, res) => {
        function parseDate(input) {
            let parts = input.match(/(\d+)/g);
            // note parts[1]-1
            return new Date(parts[2], parts[1]-1, parts[0]);
        }
        if(mongoWriteable) {
            const rb = req.body;
            const betrag = parseFloat(rb.betrag.replace(",", "."));
            if (rb.familienName !== undefined && rb.betrag !== undefined && rb.ort !== undefined) {
                db.collection('familien').update({name: rb.familienName}, {
                    $push: {
                        einkaeufe: {
                            betrag: betrag,
                            ort: rb.ort,
                            bon: req.file.filename,
                            timestamp: parseDate(rb.date)
                        }
                    }
                }, (err) => {
                    if (err) {
                        res.status(500).send("db error " + err)
                    } else {
                        db.collection('einkaeufe').insert({
                            familienName: rb.familienName,
                            betrag: betrag,
                            ort: rb.ort,
                            bon: req.file.filename,
                            timestamp: parseDate(rb.date)
                        }, (err) => {
                            if (err) {
                                res.status(500).send("db error " + err)
                            } else {
                                res.redirect(rb.orig_url);
                            }
                        });
                    }
                });
            }
        } else {
            res.status(400).send("Not available anymore!");
        }

    });
    server.post('/addEinkaufOhneKassenbon', (req, res) => {
        if(mongoWriteable) {
            const rb = req.body;
            if (rb.familienName !== undefined && rb.betrag !== undefined && rb.ort !== undefined) {
                const betrag = parseFloat(rb.betrag.replace(",", "."));
                db.collection('familien').update({name: rb.familienName}, {
                    $push: {
                        einkaeufe: {
                            betrag: betrag,
                            ort: rb.ort,
                            bon: ""
                        }
                    }
                }, (err) => {
                    if (err) {
                        res.status(500).send("db error " + err)
                    } else {
                        db.collection('einkaeufe').insert({
                            familienName: rb.familienName,
                            betrag: betrag,
                            ort: rb.ort,
                            bon: "",
                            timestamp: new Date
                        }, (err) => {
                            if (err) {
                                res.status(500).send("db error " + err)
                            } else {
                                res.redirect(rb.orig_url)
                            }
                        });
                    }
                })
            }
        } else {
            res.status(400).send("Not available anymore!");
        }
    });

    server.get('/getFamilyStatistics', (req, res) => {
        db.collection('familien').find({}).toArray((err, dbRes) => {
            if (err) {
                console.log(err);
                res.status(500).send("db error |||| " + err)
            } else {
                let response = {familien: []};
                let gesPersonenTage = 0;
                let gesAusgaben = 0;
                let gesSoll = 0;
                let gesPersonen = 0;
                for (let dbResI in dbRes) {
                    const familie = dbRes[dbResI];
                    gesPersonen += familie.anzPersonen;
                    gesPersonenTage += (familie.anzPersonen * familie.tage);
                    for (let familieEinkaeufeI in familie.einkaeufe) {
                        gesAusgaben += parseFloat(familie.einkaeufe[familieEinkaeufeI].betrag);
                    }
                    if (parseInt(dbResI) + 1 === parseInt(dbRes.length)) {
                        //res.send({ausgaben: gesAusgaben, personen: gesPersonen})
                        response.gesAusgaben = gesAusgaben;
                        response.gesPersonen = gesPersonen;
                        for (let dbResII in dbRes) {
                            const familieII = dbRes[dbResII];
                            const familieIIPersonenTage = familieII.anzPersonen * familieII.tage;
                            const anteil = familieIIPersonenTage / gesPersonenTage;
                            const sollAusgaben = Math.round((gesAusgaben * anteil) * 100) / 100;
                            let istAusgaben = 0;
                            if (familieII.einkaeufe.length === 0) {
                                response.gesPersonenTage = gesPersonenTage;
                                response.familien.push({
                                    gesPersonenTage: gesPersonenTage,
                                    name: familieII.name,
                                    anzPersonen: familieII.anzPersonen,
                                    tage: familieII.tage,
                                    anteil: anteil,
                                    sollAusgaben: sollAusgaben,
                                    istAusgaben: 0
                                })
                                gesSoll += sollAusgaben;
                                if (parseInt(dbResII) + 1 === parseInt(dbRes.length)) {
                                    response.gesSoll = gesSoll;
                                    res.send(response)
                                }
                            } else {
                                for (let familieEinkaeufeII in familieII.einkaeufe) {
                                    istAusgaben += familieII.einkaeufe[familieEinkaeufeII].betrag;
                                    if (parseInt(familieEinkaeufeII) + 1 === parseInt(familieII.einkaeufe.length)) {
                                        istAusgaben = (Math.round(istAusgaben * 100) / 100);
                                        response.gesPersonenTage = gesPersonenTage;
                                            response.familien.push({
                                            name: familieII.name,
                                            anzPersonen: familieII.anzPersonen,
                                            tage: familieII.tage,
                                            anteil: anteil,
                                            sollAusgaben: sollAusgaben,
                                            istAusgaben: istAusgaben
                                        })
                                        gesSoll += sollAusgaben;
                                        if (parseInt(dbResII) + 1 === parseInt(dbRes.length)) {
                                            response.gesSoll = gesSoll;
                                            res.send(response)
                                        }
                                    }
                                }
                            }
                            console.log(anteil);
                        }
                    }
                }
            }
        })
    })
    server.get('/getFamilien', (req, res) => {
        db.collection('familien').find({}).toArray((err, dbRes) => {
            let response = [];
            for (let dbResI in dbRes) {
                response.push(dbRes[dbResI].name);
                if (parseInt(dbResI) + 1 === parseInt(dbRes.length)) {
                    res.send(response)
                }
            }
        })
    });
    server.get('/getEinkaeufe', (req, res) => {
        db.collection('einkaeufe').find({}).toArray((err, dbRes) => {
            res.send(dbRes)
        })
    })
    server.post('/abschlussBerechnenDB', (req, res) => {
        db.collection('familien').find({}).toArray((err, dbRes) => {
            let gesPersonenTage = 0;
            let gesAusgaben = 0;
            let sended = false;
            for (let dbResI in dbRes) {
                const familie = dbRes[dbResI];
                gesPersonenTage += (familie.anzPersonen * familie.tage);
                for (let familieEinkaeufeI in familie.einkaeufe) {
                    gesAusgaben += parseFloat(familie.einkaeufe[familieEinkaeufeI].betrag);
                }
                if (parseInt(dbResI) + 1 === parseInt(dbRes.length)) {
                    //res.send({ausgaben: gesAusgaben, personen: gesPersonen})
                    for (let dbResII in dbRes) {
                        const familieII = dbRes[dbResII];
                        const familieIIPersonenTage = familieII.anzPersonen * familieII.tage
                        const anteil = familieIIPersonenTage / gesPersonenTage;
                        const sollAusgaben = Math.round((gesAusgaben * anteil) * 100) / 100;
                        let istAusgaben = 0;
                        if (familieII.einkaeufe.length === 0) {
                            db.collection('familien').update({_id: ObjectID(familieII._id)}, {
                                $set: {
                                    sollAusgaben: sollAusgaben,
                                    istAusgaben: 0,
                                    difference: (Math.round((istAusgaben - sollAusgaben) * 100) / 100)
                                }
                            })
                        } else {
                            for (let familieEinkaeufeII in familieII.einkaeufe) {
                                istAusgaben += familieII.einkaeufe[familieEinkaeufeII].betrag;
                                db.collection('familien').update({_id: ObjectID(familieII._id)}, {
                                    $set: {
                                        sollAusgaben: sollAusgaben,
                                        istAusgaben: istAusgaben,
                                        difference: (Math.round((istAusgaben - sollAusgaben) * 100) / 100)
                                    }
                                }, (err) => {
                                    if (parseInt(familieEinkaeufeII) + 1 === parseInt(familieII.einkaeufe.length)) {
                                        istAusgaben = (Math.round(istAusgaben * 100) / 100);
                                        db.collection('familien').find({}).toArray((err, dbRes) => {
                                            if (!sended) {
                                                res.send(dbRes);
                                                sended = true;
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    }
                }
            }
        })
    })
    server.post('/abschlussBerechnen', (req, res) => {
        function compare(a, b) {
            const differenceA = a.difference;
            const differenceB = b.difference;

            let comparison = 0;
            if (differenceA > differenceB) {
                comparison = 1;
            } else if (differenceA < differenceB) {
                comparison = -1;
            }
            return comparison;
        }
        db.collection('settings').update({}, {$set: {abschlussBerechnet: true}});
        db.collection('familien').find({}).toArray((err, dbRes) => {
            let familien = dbRes.sort(compare);
            for (let familienI in familien) {
                const familieI = familien[familienI];
                let familieIDiff = familieI.difference;
                if (familieI.difference < 0) {
                    // for (let familienII in familien) {
                    //     const familieII = familien[familienII];
                    //     if ()
                    //     if (familienII === familienI || familieII.difference < 0) {
                    //         continue;
                    //     }
                    //     if (familieII.difference - (familieMinus * -1) > 0) {
                    //         familien[familienII].difference = familien[familienII].difference - familieMinus;
                    //         familieMinus = 0;
                    //         console.log('a');
                    //         break;
                    //     } else {
                    //         familieMinus = (((familieMinus * -1) - familien[familienII].difference) * - 1)
                    //         familien[familienII].difference = 0;
                    //     }
                    // }
                    for (let familienII = familien.length - 1; familienII >= 0; familienII--) {
                        let familieII = familien[familienII];
                        let familieIIdiff = familieII.difference;
                        if (familieII.name !== familieI.name) {
                            if (familieIDiff < familieIIdiff) {
                                if((familieIDiff + familieIIdiff) > 0) {
                                    familieIIdiff = familieIIdiff - (familieIDiff + familieIIdiff);
                                }
                                if(familieIIdiff !== 0) {
                                    console.log(familieI.name + "->" + familieII.name + " (" + familieIIdiff + ")");
                                    familieIDiff = (Math.round((familieIDiff + familieIIdiff) * 100) / 100);
                                    familien[familienI].difference = familieIDiff;
                                    //familieIIdiff = 0;
                                    familien[familienII].difference = familien[familienII].difference - familieIIdiff;
                                    console.log("Fall A");
                                    db.collection('familien').update({name: familieI.name}, {
                                        $push: {
                                            transaktionen: {
                                                betrag: familieIIdiff,
                                                bezahlen: true,
                                                partner: familieII.name
                                            }
                                        }
                                    }, (err) => {
                                        if(!err) {
                                            db.collection('familien').update({name: familieII.name}, {
                                                $push: {
                                                    transaktionen: {
                                                        betrag: familieIIdiff,
                                                        bezahlen: false,
                                                        partner: familieI.name
                                                    }
                                                }
                                            }, (err) => {
                                            });
                                        }
                                    });
                                }
                                //continue II;
                            } else if (familieIDiff > familieIIdiff) {
                                if (familieIDiff !== 0) {
                                    console.log(familieI.name + "->" + familieII.name + " (" + familieIDiff + ")");
                                    familieIIdiff = familieIIdiff - familieIDiff;
                                    familien[familienII].difference = familieIIdiff;
                                    familien[familienI].difference = 0;
                                    familieIDiff = 0;
                                    console.log("Fall B")
                                    db.collection('familien').update({name: familieI.name}, {
                                        $push: {
                                            transaktionen: {
                                                betrag: familieIDiff,
                                                bezahlen: true,
                                                partner: familieII.name
                                            }
                                        }
                                    }, (err) => {
                                        if(!err) {
                                            db.collection('familien').update({name: familieII.name}, {
                                                $push: {
                                                    transaktionen: {
                                                        betrag: familieIDiff,
                                                        bezahlen: false,
                                                        partner: familieI.name
                                                    }
                                                }
                                            }, (err) => {
                                            });
                                        }
                                    });
                                    break;
                                }
                            } else if (familieIDiff == familieIIdiff) {
                                familieIDiff = 0;
                                familieIIdiff = 0;
                                familien[familienI].difference = 0;
                                familien[familienII].difference = 0;
                                console.log("Fall C")
                                break;
                            }
                        }
                    }
                }
                if ((parseInt(familienI) + 1) === parseInt(familien.length)) {
                    console.log('b');
                    res.send(familien)
                }
            }
        })
    });
    server.get('/getSettings', (req, res) => {
        db.collection('settings').find({}).toArray((err, dbRes) => {
            res.send(dbRes[0])
        })
    })
    server.post('/getFamilyDetails', (req, res) => {
        db.collection('familien').find({name: req.body.name}).toArray((err, dbRes) => {
            console.error(err)
            res.send(dbRes[0])
        })
    })
    server.listen(4000, () => {
        console.log('LabCode KBB backend is listening on 4000');
    });
});
