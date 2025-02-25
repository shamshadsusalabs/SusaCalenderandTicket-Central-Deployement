const admin = require('firebase-admin')

// Initialize firebase admin SDK


var serviceAccount = require("./susacalenderweb-firebase-adminsdk-c73vf-924ceea4a8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://susacalenderweb.appspot.com'
})

// Cloud storage
const bucket = admin.storage().bucket()

module.exports = {
  bucket
}