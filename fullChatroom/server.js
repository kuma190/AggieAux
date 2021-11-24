const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const socketHandler = require('./utils/socketEvents.js')
// const formatMessage = require('./utils/messages');
// const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//Set static folder
app.use(express.static(path.join(__dirname,'public')));


//Running when client connects
io.on('connection',socket => {
    socketHandler.socketEvents(socket,io);
});

const PORT = process.env.PORT|| 3000;
//.listen() to run the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



