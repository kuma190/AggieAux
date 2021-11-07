
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5500;
app.use(express.static('public'))
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));


//Connection of a client from the front-end
io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('message', `Hello user ${socket.id.substr(0,2)}!`);

    //default username
    let userName = socket.id.substr(0,2);

    //user-defined username
    socket.on('theUserName', (message) => {
        userName = message;
    });

    //emitting the message to all clients
    socket.on('message', (message) =>     {
        console.log(message);
        io.emit('message', `${userName} said ${message}` );   
    });
});

http.listen(PORT,function() {
    console.log(`listening on ${PORT}`);
})


// Regular Websockets

// const WebSocket = require('ws')
// const server = new WebSocket.Server({ port: '8080' })

// server.on('connection', socket => { 

//   socket.on('message', message => {

//     socket.send(`Roger that! ${message}`);

//   });

// });


 
