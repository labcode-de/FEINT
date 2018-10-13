const PP_Google_Strategy = require("passport-google-oauth").OAuth2Strategy;
const config = require('./auth-config');

const googleStrategy = (passport, db) => {
    passport.use(new PP_Google_Strategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURI
        },
        function (accessToken, refreshToken, profile, done) {
            db.collection('users').findOne({'email': profile.emails[0].value},
                function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        db.collection('users').insert({
                            email: profile.emails[0].value,
                            name: profile.name
                        }, (err) => {
                            if(err) return done(err);
                        })
                    }
                    return done(null, user);
                }
            );
        }
    ));
};
module.exports.googleStrategy = googleStrategy;