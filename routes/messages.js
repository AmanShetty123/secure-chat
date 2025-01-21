module.exports = (io) => {
    const express = require("express");
    const { db } = require("../config/firebase");
    const router = express.Router();
    const {encryptMessage} = require("../utils/encryption")
    const { decryptMessage } = require("../utils/encryption");
    // Send Message
    router.post("/send", async (req, res) => {
      const { senderId, receiverId, message } = req.body;
  
      try {

        const encryptedMessage = encryptMessage(message)
        // Save the message in Firestore
        const messageRef = await db.collection("messages").add({
          senderId,
          receiverId,
          message: encryptedMessage,
          timestamp: new Date(),
          status: "sent",
        });
  
        // Broadcast the message to the receiver
        io.emit("receiveMessage", {
          id: messageRef.id,  
          senderId,
          receiverId,
          message: encryptedMessage,
          timestamp: new Date(),
          status: "sent"
        });
  
        res.status(201).send({ message: "Message sent successfully!", id: messageRef.id });
      } catch (error) {
        res.status(400).send({ error: error.message });
      }
    });
  
    router.put("/delivered/:messageId", async(req, res) => {
        const {messageId} = req.params;
        try {
            await db.collection("messages").doc(messageId).update({
                status: "delieverd",
            })

            //broadcast the update status on the client side 
            io.emit("messageStatusUpdate", {
                messageId,
                status: "delivered",
            })

            res.status(200).send({message: "Message status updated to delivered"})
        } catch (error) {
            res.status(400).send({error: error.message})
        }
    })

    router.put("/read/:messageId", async (req, res) => {
        const { messageId } = req.params;
      
        try {
          // Update the message status to "read"
          await db.collection("messages").doc(messageId).update({
            status: "read",
          });
      
          // Broadcast the updated status
          io.emit("messageStatusUpdate", {
            messageId,
            status: "read",
          });
      
          res.status(200).send({ message: "Message status updated to read!" });
        } catch (error) {
          res.status(400).send({ error: error.message });
        }
      });

      router.get("/:userId", async (req, res) => {
        const { userId } = req.params;
      
        try {
          // Fetch messages for the user
          const messagesSnapshot = await db
            .collection("messages")
            .where("receiverId", "==", userId)
            .get();
      
          const messages = [];
          messagesSnapshot.forEach((doc) => {
            const messageData = doc.data();
            // Decrypt the message
            const decryptedMessage = decryptMessage(messageData.message);
            messages.push({ id: doc.id, ...messageData, message: decryptedMessage });
          });
      
          res.status(200).send(messages);
        } catch (error) {
          res.status(400).send({ error: error.message });
        }
      });
    return router;
  };