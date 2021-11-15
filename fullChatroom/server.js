const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//Set static folder
app.use(express.static(path.join(_dirname,'public')));

const botName = "Reveille";

//Running when client connects
io.on('connection',socket => {
    socket.on('joinRoom', ({username,room}) => {

        const user = userJoin(socket.id,username,room);
        socket.join(user.room);

        //Welcome new user
        socket.emit('message',formatMessage(botName,'Welcome to Aggie Aux!'));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //Send users and room info 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //Use this to send a mesage to ALL clients
    //io.emit()

    //Listen for message sent by the client
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} just dipped. F.`));

        }

        //Send list of users and room info when a new user joins to update info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

});

const PORT = 3000 || process.env.PORT;
//.listen() to run the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
