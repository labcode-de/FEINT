const db = require('../index').db;
const ObjectID = require('mongodb').ObjectID;
const generateString = require('../helper/generateString').generateString;

const getFamilyStats = (req, res) => {
    db.collection("events").findOne({"identifier": req.params.eventIdentifier}, (err, dbResEvent) => {
        if (err) {
            console.log(err);
            res.status(500).send("db error |||| " + err)
        } else {
            db.collection("users").find({"allowedEvents": {$elemMatch: {"eventId": dbResEvent._id}}}).toArray((err, dbResFamilies) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("db error |||| " + err)
                } else {
                    let httpResponse = {families: []};
                    let totalPeopleDays = 0;
                    let totalAmount = 0;
                    let totalDebit = 0;
                    for (let dbResFamilyI in dbResFamilies) {
                        if (dbResFamilies.hasOwnProperty(dbResFamilyI)) {
                            const family = dbResFamilies[dbResFamilyI];
                            let familyCurrentAmount = 0;
                            for (let dbResFamilyAllowedEventI in family.allowedEvents) {
                                if (family.allowedEvents.hasOwnProperty(dbResFamilyAllowedEventI)) {
                                    const familyAllowedEvent = family.allowedEvents[dbResFamilyAllowedEventI];
                                    if (familyAllowedEvent.eventId.toString() === dbResEvent._id.toString()) {
                                        totalPeopleDays += (familyAllowedEvent.people * familyAllowedEvent.days);
                                        for (let purchasesI in dbResEvent.purcharses) {
                                            if (dbResEvent.purcharses.hasOwnProperty(purchasesI)) {
                                                let purchase = dbResEvent.purcharses[purchasesI];
                                                if (purchase.family.toString() === family._id.toString()) {
                                                    totalAmount += parseFloat(purchase.amount);
                                                    familyCurrentAmount += purchase.amount;
                                                }
                                            }
                                        }
                                        httpResponse.families.push({
                                            "name": family.familyName,
                                            "numPeople": familyAllowedEvent.people,
                                            "numDays": familyAllowedEvent.days,
                                            "peopleDays": familyAllowedEvent.people * familyAllowedEvent.days,
                                            "currentAmount": familyCurrentAmount,
                                            "share": 0,
                                            "debit": 0
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    for (const httpFamilyI in httpResponse.families) {
                        let httpResponseFamily = httpResponse.families[httpFamilyI];
                        httpResponseFamily.share = httpResponseFamily.peopleDays / totalPeopleDays;
                        httpResponseFamily.debit = Math.round((totalAmount * httpResponseFamily.share) * 100) / 100;
                        totalDebit += httpResponseFamily.debit;
                    }
                    httpResponse.totalAmount = totalAmount;
                    httpResponse.totalDebit = totalDebit;
                    httpResponse.totalPeopleDays = totalPeopleDays;
                    httpResponse.privateCode = dbResEvent.privateCode;
                    httpResponse.name = dbResEvent.name;
                    res.send(httpResponse)
                }
            })
        }
    })
};
module.exports.getFamilyStats = getFamilyStats;

const createEvent = (req, res) => {
    db.collection('events').find({identifier: req.body.identifier}).toArray((err, dbResEvents) => {
        if (err) {
            console.log(err);
            res.status(500).send("db error |||| " + err)
        } else {
            if (dbResEvents.length !== 0) {
                res.status(400).send("Identifier used")
            } else {
                const privateCode = generateString(10);
                db.collection('events').insertOne({
                    "name": req.body.name,
                    "identifier": req.body.identifier,
                    "privateCode": privateCode,
                    purcharses: []
                }, (err, dbResEventAdd) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("db error |||| " + err)
                    } else {
                        db.collection('users').updateOne({_id: ObjectID(req.inspector.user._id)}, {
                            $push: {
                                allowedEvents: {
                                    eventId: dbResEventAdd.insertedId,
                                    people: 0,
                                    days: 0
                                }
                            }
                        }, ((err) => {
                            if (err) {
                                console.log(err);
                                res.status(500).send("db error |||| " + err)
                            } else {
                                res.send("OK")
                            }
                        }));
                    }
                })
            }
        }
    })
};
module.exports.createEvent = createEvent;

const addTokenEvent = (req, res) => {
    let eventIdentifier = req.body.token.split("_")[0];
    let privateCode = req.body.token.split("_")[1];
    db.collection('events').findOne({identifier: eventIdentifier, privateCode: privateCode}, (err, dbResEvent) => {
        if (err) {
            console.log(err);
            res.status(500).send("db error |||| " + err)
        } else {
            if (dbResEvent === null || dbResEvent === undefined || req.inspector.user.allowedEvents.some(e => e.eventId.toString() === dbResEvent._id.toString())) {
                res.status(400).send("Token incorrect")
            } else {
                db.collection('users').updateOne({_id: ObjectID(req.inspector.user._id)}, {
                    $push: {
                        allowedEvents: {
                            eventId: dbResEvent._id,
                            people: 0,
                            days: 0
                        }
                    }
                }, ((err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("db error |||| " + err)
                    } else {
                        res.send("OK")
                    }
                }));
            }
        }
    })
};

module.exports.addTokenEvent = addTokenEvent;

const changeUserEventDetails = (req, res) => {
    if (req.body.persons && req.body.days) {
        db.collection('events').findOne({identifier: req.params.eventIdentifier}, (err, dbResEvent) => {
            if (err) {
                console.log(err);
                res.status(500).send("db error |||| " + err)
            } else {
                db.collection("users").updateOne({
                        _id: ObjectID(req.inspector.user._id),
                        'allowedEvents.eventId': ObjectID(dbResEvent._id)
                    }, {
                        $set: {
                            "allowedEvents.$.people": req.body.persons,
                            "allowedEvents.$.days": req.body.days
                        }
                    }, ((err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send("db error |||| " + err)
                        } else {
                            res.send("OK")
                        }
                    })
                )
            }
        })
    } else {
        res.status(400).send("Malformed Request");
    }
}

module.exports.changeUserEventDetails = changeUserEventDetails;