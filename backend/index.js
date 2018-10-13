const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const dbURL = "mongodb://db:27017";
const dbName = "labcodeKBB";
const passport  = require('passport');
const auth_config = require('./auth/auth-config');
const {initAuthentication} = require('./auth/initAuthentication');
const session = require('express-session')
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cors());
server.use(session({
    secret: auth_config.session.secret,
    resave: false,
    saveUninitialized: false
}));

server.use(express.static('public'));

MongoClient.connect(dbURL, (err, mongoClient) => {
    if (err) throw err;
    const db = mongoClient.db(dbName);

    initAuthentication(passport, db);
    server.use(passport.initialize());
    server.use(passport.session());

    server.get('', (req, res) => {
        res.send('Hey there Alpakas!');
    });

    server.get("/auth/google", passport.authenticate('google', { scope: ['openid email profile'] }))
    server.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'https://feint.labcode.de/login' }),
        function(req, res) {
            // Authenticated successfully
            res.redirect('https://feint.labcode.de/');
        });


    server.listen(4000, () => {
        console.log('LabCode KBB backend is listening on 4000');
    });
});
