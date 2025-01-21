const express = require("express");
const http = require("http")
const {Server} = require("socket.io")
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth")
const messageRoutes = require("./routes/messages")
const fileRoutes = require("./routes/files")
// Load environment variables
dotenv.config();
// Initialize Express
const app = express();
const server = http.createServer(app);
const io = new Server(server)
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes(io))
app.use("/api/files", fileRoutes)

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

//Socket IO connection 
io.on("connection", (socket)=> {
  console.log("A user connected", socket.id);

  //handle disconnection here itself
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
