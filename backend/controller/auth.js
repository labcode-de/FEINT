//////// AUTH CONTROLLER
const jwt = require("jsonwebtoken");
const auth_config = require('../auth/auth-config');
const passport = require("passport");

const googleCallback = (req, res, next) => {
    passport.authenticate('google', {failureRedirect: 'https://feint.labcode.de/login'}, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.redirect('http://localhost:40021/login');
        }

        const userData = {id: user._id, service_id: user.service_id, service: user.authenticatedServices};

        const tokenData = {
            user: userData
        };

        const token = jwt.sign(tokenData,
            auth_config.jwt_token.secret,
            {expiresIn: auth_config.jwt_token.expiresIn});

        res.cookie(auth_config.jwt_token.cookie_name, token,  { expires: new Date(Date.now() + 2628000000)});
        res.redirect('http://localhost:40021');

    })(req, res, next);
};
module.exports.googleCallback = googleCallback;