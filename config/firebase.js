const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-bf125.firebaseio.com", // Replace with your Firestore URL
});

const db = admin.firestore();
module.exports = { admin, db };