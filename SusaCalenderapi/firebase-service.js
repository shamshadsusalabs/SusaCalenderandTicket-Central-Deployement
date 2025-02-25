const admin = require('firebase-admin')

var serviceAccount = require("./susacalenderweb-firebase-adminsdk-c73vf-924ceea4a8.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
