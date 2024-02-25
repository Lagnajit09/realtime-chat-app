const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const router = require("./router");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(router);

io.on("connect", (socket) => {
  console.log("User connected");

  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);
  });

  socket.on("disconnection", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server has started.`);
});
