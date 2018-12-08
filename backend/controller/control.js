const ObjectID = require("mongodb").ObjectID;
const db = require('../index').db;
const changeProfile = (req, res) => {
  const body = req.body;
  if(body.firstName !== undefined && body.familyName !== undefined) {
      db.collection('users').updateOne({_id: ObjectID(req.inspector.user._id)}, {$set: {firstName: body.firstName, familyName: body.familyName}}, ((err, dbRes) => {
      if(err) {
        res.status(500).send('DB Error');
      } else {
        res.send('OK');
      }
    }))
  } else {
    res.status(400).send("Bad Request")
  }
};

module.exports.changeProfile = changeProfile;