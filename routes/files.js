const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { db } = require("../config/firebase");
const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Upload File
router.post("/upload", upload.single("file"), async (req, res) => {
  const { senderId, receiverId } = req.body;
  const file = req.file;

  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "chat-app", // Optional: Organize files in a folder
    });

    // Save file metadata in Firestore
    const fileRef = await db.collection("files").add({
      senderId,
      receiverId,
      fileName: file.originalname,
      fileUrl: result.secure_url,
      timestamp: new Date(),
    });

    res.status(201).send({
      message: "File uploaded successfully!",
      fileUrl: result.secure_url,
      fileId: fileRef.id,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get Files
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Fetch files for the user
      const filesSnapshot = await db
        .collection("files")
        .where("receiverId", "==", userId)
        .get();
  
      const files = [];
      filesSnapshot.forEach((doc) => {
        files.push({ id: doc.id, ...doc.data() });
      });
  
      res.status(200).send(files);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });
module.exports = router;