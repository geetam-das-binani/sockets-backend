import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();

const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: true,
  },
});
app.get("/", (req, res) => {
  res.send("hey");
});
io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);
  socket.on("joined", ({ name }) => { 
    socket.broadcast.emit("new_user", { name });
  });
  socket.on("message", (data) => {
    // socket.broadcast.emit("recieved_message", data);
    socket.to(data.room).emit('recieved_message',data)
  });
  socket.on('join',(data)=>{
    socket.join(data)
  })
});

server.listen(3000, () => console.log("server is running on port 3000"));
