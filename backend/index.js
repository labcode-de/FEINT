const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const dbURL = "mongodb://db:27017";
const dbName = "labcodeFEINT";
const passport = require('passport');
const {initAuthentication} = require('./auth/initAuthentication');

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cors());

server.use(express.static('public'));

MongoClient.connect(dbURL, (err, mongoClient) => {
    if (err) throw err;
    const db = mongoClient.db(dbName);
    module.exports.db = db;

    initAuthentication(passport, db);
    const isAuthenticated = require("./auth/isAuthenticated").isAuthenticated;  //// REQUIRE MIDDLEWARE AFTER DB EXPORT
    const isAuthenticatedAndAuthorizedEvent = require("./auth/isAuthenticated").isAuthenticatedAndAuthorizedEvent;  //// REQUIRE MIDDLEWARE AFTER DB EXPORT
    const controlController = require('./controller/control');
    const authController = require('./controller/auth');
    const eventController = require('./controller/event');
    server.use(passport.initialize());
    server.get('', (req, res) => {
        res.send('Hey there Alpacas!');
    });

    server.get("/user/google", passport.authenticate('google', {scope: ['openid email profile']}))
    server.get('/user/google/callback', authController.googleCallback);
    server.get('/user/getProfile', isAuthenticated, authController.getProfile);

    server.post('/control/changeProfile', isAuthenticated, controlController.changeProfile);

    server.get('/event/:eventId/getFamilyStats', isAuthenticatedAndAuthorizedEvent, eventController.getFamilyStats)

        server.listen(4000, () => {
        console.log('LabCode FEINT backend is listening on 4000');
    });
});