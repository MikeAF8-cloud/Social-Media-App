const admin = require('firebase-admin');

const serviceAccount = require("../ApiKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://social-media-app-42f08.firebaseio.com"
});

//Get access to the database
const db = admin.firestore();

module.exports = {admin, db};