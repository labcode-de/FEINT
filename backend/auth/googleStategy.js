const PP_Google_Strategy = require("passport-google-oauth").OAuth2Strategy;
const config =  require('./auth-config');

export const googleStrategy = (passport) => {
    passport.use(new PP_Google_Strategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURI
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return done(err, user);
            });
        }
    ));
}
