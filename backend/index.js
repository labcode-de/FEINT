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
const authController = require('./controller/auth')
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
    server.use(passport.initialize());
    server.get('', (req, res) => {
        res.send('Hey there Alpacas!');
    });

    server.get("/user/google", passport.authenticate('google', {scope: ['openid email profile']}))
    server.get('/user/google/callback', authController.googleCallback);
    server.get('/user/getProfile', isAuthenticated, (req, res) => {
        res.send(req.inspector.user); // DEINFED IN isAuthenticated
    });


    server.listen(4000, () => {
        console.log('LabCode FEINT backend is listening on 4000');
    });
});