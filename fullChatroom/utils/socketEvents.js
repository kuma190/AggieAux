const formatMessage = require('./messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./users');


const botName = "Reveille";

exports.socketEvents = async (client,server) => {
    client.on('joinRoom', ({username,room,isBroadcaster}) => {

        //First user to join room becomes the broadcaster
        if (getRoomUsers(room).length === 1) {
            isBroadcaster = true;
        }
        //client = socket.io client api
        //server = socket.io server api
        const user = userJoin(client.id,username,room,isBroadcaster);
        client.join(user.room);

        //Welcome new user
        client.emit('message',formatMessage(botName,'Welcome to Aggie Aux!'));

        //Broadcast when a user connects
        client.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //Send users and room info 
        server.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //Use this to send a mesage to ALL clients
    //server.emit()

    //Listen for message sent by the client
    client.on('chatMessage', msg => {
        const user = getCurrentUser(client.id);
        //Send to everybody
        server.to(user.room).emit('message',formatMessage(user.username,msg));
    });

    // client.on('videoMessage', (state) => {
    //     const user = getCurrentUser(client.id);
    //     server.to(user.room).emit('videoMessage', state.state);
    //     });
    
    client.on('playbackState', (state) => {
        const user = getCurrentUser(client.id);
        server.to(user.room).emit('playbackState', state.state);
    });

    client.on('seekEvent', (seekValue) => {
        const user = getCurrentUser(client.id);
        server.to(user.room).emit('seekEvent', seekValue);
    });

    client.on('videoRequest', (vidLink) => {
        const user = getCurrentUser(client.id);
        server.to(user.room).emit('videoRequest', vidLink);
    });
    
    client.on('broadcaster', () => {
        console.log("Hello world1");
    })

    client.on('watcher', (roomName) => {
        console.log("hello world2");
        var currUsers = getRoomUsers(roomName);

        if (currUsers.length != 0) {
            currUsers.filter(user => user.isBroadcaster == true);
            client.to(currUsers.at(0).id).emit("watcher",client.id);
        }
    });

        //peer to peer
    client.on("offer", (id, message) => {
        server.to(id).emit("offer", client.id, message);
    });
    //peer to peer
    client.on("answer", (id, message) => {
        server.to(id).emit("answer", client.id, message);
    });
    //peer to peer
    client.on("candidate", (id, message) => {
        server.to(id).emit("candidate", client.id, message);
    });

    client.on('disconnect', () => {
        let theUserLeaving = getCurrentUser(client.id);
        if (theUserLeaving != undefined) {
            let listUsers = getRoomUsers(theUserLeaving.room);
            let theBroadcaster = listUsers.find(theUserLeaving => ((theUserLeaving.isBroadcaster == true)));
            server.to(theBroadcaster).emit("disconnectPeer",client.id);
        }

        const user = userLeave(client.id);

        if (user) {
            server.to(user.room).emit('message',formatMessage(botName,`${user.username} just dipped. F.`));
            server.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

};