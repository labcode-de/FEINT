const {googleStrategy} = require("./googleStategy");

const initAuthentication = (passport) => {
    passport.serializeUser(function(user, done) {
        // done(null, user.id);
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        // Users.findById(obj, done);
        done(null, obj);
    });
    googleStrategy(passport);
};
module.exports.initAuthentication = initAuthentication;