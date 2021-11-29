const express = require("express");
const app = express();

var counter = 0
var rooms = {}
let broadcaster;
const port = process.env.PORT|| 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  socket.on("broadcaster", () => {
    counter +=1
    rooms[socket.id] = {"room": counter, "users":{}}
    console.log(rooms)
    socket.broadcast.emit("requestRooms",rooms);
    //broadcaster = socket.id;
    //socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", (roomNo) => {
    for (key in rooms){
      if (socket.id in rooms[key]["users"]){
        delete rooms[key]["users"][socket.id]
        break
      }
    }
    for (key in rooms){
      console.log(key,rooms[key]["room"],roomNo)
      if (rooms[key]["room"] == roomNo){
        broadcaster = key
        break
        
      }
    }
    console.log(broadcaster)
    if (broadcaster){
      console.log("watcher's broadcaster",broadcaster)
      rooms[broadcaster]['users'][socket.id] = true;
      console.log(rooms)
      socket.to(broadcaster).emit("watcher", socket.id);
    }
  });
  socket.on("requestRooms",()=>{
    console.log("requestRooms",socket.id);
    socket.emit("requestRooms",rooms);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", () => {
    let disbroadcaster;
    console.log("whoever trying to disconnect",socket.id)
    if (socket.id in rooms){
      for (key in rooms[socket.id]["users"]){
        socket.to(key).emit("broadcastDC",socket.id);
      }
      delete rooms[socket.id]
    }
    for (key in rooms){
      if (socket.id in rooms[key]["users"]){
        disbroadcaster = key
        delete rooms[disbroadcaster]["users"][socket.id]
        
      }
    }
    console.log(rooms)
    socket.to(disbroadcaster).emit("disconnectPeer", socket.id);
  });
  socket.on("disconnectBroadcaster", (id) => {
    console.log("disconnect broadcaster")
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
