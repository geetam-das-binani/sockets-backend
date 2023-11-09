import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: true,
  },
});
app.use(express.static("./public/dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/dist", "index.html"));
});
io.on("connection", (socket) => {
  socket.on("joined", ({ name }) => {
    socket.broadcast.emit("new_user", { name });
  });
  socket.on("message", (data) => {
    // socket.broadcast.emit("recieved_message", data);
    socket.to(data.room).emit("recieved_message", data);
  });
  socket.on("join", (data) => {
    socket.join(data);
  });
});

server.listen(3000, () => console.log("server is running on port 3000"));
