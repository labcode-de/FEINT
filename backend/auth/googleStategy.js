const PP_Google_Strategy = require("passport-google-oauth").OAuth2Strategy;
const config = require('./auth-config');

const googleStrategy = (passport, db) => {
    passport.use(new PP_Google_Strategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURI
        },
        function (accessToken, refreshToken, profile, done) {
            db.collection('users').findOne({'service_id': profile.id, authenticatedServices: "google"},
                function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        db.collection('users').insert({
                            service_id: profile.id,
                            authenticatedServices: "google",
                            email: profile.emails[0].value,
                            firstName: profile.name.givenName,
                            familyName: profile.name.familyName,
                            allowedEvents: []
                        }, (err, dbInsertRes) => {
                            if(err) {
                                return done(err);
                            } else {
                                return done(null, dbInsertRes)
                            }
                        })
                    }
                    return done(null, user);
                }
            );
        }
    ));
};
module.exports.googleStrategy = googleStrategy;