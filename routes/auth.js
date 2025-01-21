const express = require("express");
const { admin, db } = require("../config/firebase");
const router = express.Router();
const firebase = require("firebase-admin");

//user registration
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    //create user in firebase auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      firstName,
      lastName,
    });
    await db.collection("users").doc(userRecord.uid).set({
      firstName,
      lastName,
      email,
      createdAt: new Date(),
    });
    res
      .status(201)
      .send({ message: "User Registered Successfully!", uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await firebase.auth().getUserByEmail(email);
    //we have to add the authentication function later
    res
      .status(200)
      .send({ message: "Login Successful",uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Update User Profile
router.put("/update-profile", async (req, res) => {
  const { uid, firstName, lastName } = req.body;

  try {
    // Update user details in Firestore
    await db.collection("users").doc(uid).update({
      firstName,
      lastName,
      updatedAt: new Date(),
    });

    res.status(200).send({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
module.exports = router;
