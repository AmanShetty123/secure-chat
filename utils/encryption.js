const CryptoJS = require("crypto-js");
const dotenv = require("dotenv")
dotenv.config()
// Secret key for encryption (should be stored securely in environment variables)
const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY || "default-secret-key";

// Encrypt a message
const encryptMessage = (message) => {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
};

// Decrypt a message
const decryptMessage = (encryptedMessage) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptMessage, decryptMessage };