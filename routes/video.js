module.exports = (io) => {
  const express = require("express");
  const router = express.Router();

  router.post("/call", (req, res) => {
    const { senderId, receiverId, callType } = req.body;

    // Validate call type
    if (callType !== "video" && callType !== "voice") {
      return res
        .status(400)
        .send({ error: "Invalid call type. Use 'video' or 'voice'." });
    }

    io.to(receiverId).emit("incomingCall", {
      senderId,
      callType
    });

    res.status(200).send({ message: "Call initiated successfully!" });
  });
  return router;
};
