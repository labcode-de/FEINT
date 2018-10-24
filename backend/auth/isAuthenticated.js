const jwt = require("jsonwebtoken");
const auth_config = require('./auth-config');
const ObjectID = require("mongodb").ObjectID;
const db = require('../index').db;
const isAuthenticated = (req, res, next) => {
    const token = req.headers['x-access-token'];
    let error = false;
    if (token) {
        try {
            const decoded = jwt.verify(token, auth_config.jwt_token.secret);
            db.collection("users").findOne({
                service_id: decoded.user.service_id,
                _id: ObjectID(decoded.user.id),
                authenticatedServices: decoded.user.service
            }, (err, dbRes) => {
                req.inspector = {
                    isAuthenticated: true,
                    JWTuser: decoded.user,
                    user: dbRes
                };
                return next();
            });
        } catch (err) {
            error = true;
        }
    } else {
        return res.status(401).json({error: 'Invalid access token!'});
    }
    if (error) {
        return res.status(401).json({error: 'Invalid access token!'});
    }
}
module.exports.isAuthenticated = isAuthenticated;
const isAuthenticatedAndAuthorizedEvent = (req, res, next) => {
    const token = req.headers['x-access-token'];
    const eventId = req.params.eventId;
    let error = false;
    if (token) {
        try {
            const decoded = jwt.verify(token, auth_config.jwt_token.secret);
            db.collection("users").findOne({
                service_id: decoded.user.service_id,
                _id: ObjectID(decoded.user.id),
                authenticatedServices: decoded.user.service
            }, (err, dbResUsers) => {
                req.inspector = {
                    isAuthenticated: true,
                    JWTuser: decoded.user,
                    user: dbResUsers
                };
                let userAllowedEvents = dbResUsers.allowedEvents;
                let allowedEventIDs = [];
                let allowedEventIDsString = []
                for (const allowedEventI in userAllowedEvents) {
                    if (userAllowedEvents.hasOwnProperty(allowedEventI)) {
                        const allowedEvent = userAllowedEvents[allowedEventI];
                        allowedEventIDs.push(allowedEvent.eventId);
                        allowedEventIDsString.push(allowedEvent.eventId.toString());
                    }
                }
                db.collection("events").findOne({'identifier': eventId}, (err, event) => {
                    if(event !== null) {
                        if (allowedEventIDsString.includes(event._id.toString())) {
                            let allowedEvent = dbResUsers.allowedEvents[allowedEventIDsString.indexOf(event._id.toString())];
                            allowedEvent.identifier = event.identifier;
                            let allowedEventIdentifier = [];
                            dbResUsers.allowedEvents.forEach((allowedEvent) => {
                                allowedEventIdentifier.push(allowedEvent.identifier);
                            });
                            if (allowedEventIdentifier.includes(eventId)) {
                                return next();
                            } else {
                                res.status(401).json({error: 'Not a allowed event for access token or no event is available with this identifier!'});
                            }
                        } else {
                            res.status(401).json({error: 'Not a allowed event for access token or no event is available with this identifier!'});
                        }
                    } else {
                        res.status(401).json({error: 'Not a allowed event for access token or no event is available with this identifier!'});
                    }
                });

            });
        } catch (err) {
            res.status(401).json({error: 'Invalid access token!'});
        }
    } else {
        return res.status(401).json({error: 'Invalid access token!'});
    }
}
module.exports.isAuthenticatedAndAuthorizedEvent = isAuthenticatedAndAuthorizedEvent;