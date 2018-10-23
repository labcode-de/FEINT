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
            db.collection("users").findOne({service_id: decoded.user.service_id, _id: ObjectID(decoded.user.id), authenticatedServices: decoded.user.service}, (err, dbRes) => {
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
    if(error) {
        return res.status(401).json({error: 'Invalid access token!'});
    }
}
module.exports.isAuthenticated = isAuthenticated;