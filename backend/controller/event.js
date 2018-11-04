const db = require('../index').db;

const getFamilyStats = (req, res) => {
    db.collection("events").findOne({"identifier": req.params.eventId}, (err, dbResEvent) => {
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
                        if(dbResFamilies.hasOwnProperty(dbResFamilyI)) {
                            const family = dbResFamilies[dbResFamilyI];
                            let familyCurrentAmount = 0;
                            for (let dbResFamilyAllowedEventI in family.allowedEvents) {
                                if(family.allowedEvents.hasOwnProperty(dbResFamilyAllowedEventI)) {
                                    const familyAllowedEvent = family.allowedEvents[dbResFamilyAllowedEventI];
                                    if (familyAllowedEvent.eventId.toString() === dbResEvent._id.toString()) {
                                        totalPeopleDays += (familyAllowedEvent.people * familyAllowedEvent.days);
                                        for (let purchasesI in dbResEvent.purcharses) {
                                            if (dbResEvent.purcharses.hasOwnProperty(purchasesI)) {
                                                let purchase = dbResEvent.purcharses[purchasesI];
                                                if(purchase.family.toString() === family._id.toString()) {
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
                    for(const httpFamilyI in httpResponse.families) {
                        let httpResponseFamily = httpResponse.families[httpFamilyI];
                        httpResponseFamily.share = httpResponseFamily.peopleDays / totalPeopleDays;
                        httpResponseFamily.debit = Math.round((totalAmount * httpResponseFamily.share) * 100) / 100;
                        totalDebit += httpResponseFamily.debit;
                    }
                    httpResponse.totalAmount = totalAmount;
                    httpResponse.totalDebit = totalDebit;
                    httpResponse.totalPeopleDays = totalPeopleDays;
                    res.send(httpResponse)
                }
            })
        }
    })
};
module.exports.getFamilyStats = getFamilyStats;