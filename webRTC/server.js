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
  //when broadcaster emits message, create new room for it
  socket.on("broadcaster", () => {
    counter +=1
    rooms[socket.id] = {"room": counter, "users":{}}
    console.log(rooms)
    socket.broadcast.emit("requestRooms",rooms);
    //broadcaster = socket.id;
    //socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", (roomNo) => {
    //deletes user from previous room it has been in
    for (key in rooms){
      if (socket.id in rooms[key]["users"]){
        delete rooms[key]["users"][socket.id]
        break
      }
    }
    //add user to room roomNo
    for (key in rooms){
      console.log(key,rooms[key]["room"],roomNo)
      if (rooms[key]["room"] == roomNo){
        broadcaster = key
        break
        
      }
    }
    //if broadcaster exists, let broadcaster know watcher has joined
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
  //peer to peer
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  //peer to peer
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  //peer to peer
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", () => {
    
    let disbroadcaster;
    console.log("whoever trying to disconnect",socket.id)
    //looking if broadcaster is trying to disconnect
    if (socket.id in rooms){
      for (key in rooms[socket.id]["users"]){
        //sends disconnect message to all users
        socket.to(key).emit("broadcastDC",socket.id);
      }
      //deletes broadcaster's room
      delete rooms[socket.id]
    }
    //checks if user is trying to disconnect
    for (key in rooms){
      if (socket.id in rooms[key]["users"]){
        //finds user's current room's broadcaster
        disbroadcaster = key
        //deletes user from users dict in the room
        delete rooms[disbroadcaster]["users"][socket.id]
        
      }
    }
    console.log(rooms)
    //sends message to broadcaster to disconnect the user peer
    socket.to(disbroadcaster).emit("disconnectPeer", socket.id);
  });
  //useless
  socket.on("disconnectBroadcaster", (id) => {
    console.log("disconnect broadcaster")
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
