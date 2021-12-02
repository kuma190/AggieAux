const formatMessage = require('./messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./users');


const botName = "Reveille";

exports.socketEvents = async (client,server) => {
    client.on('joinRoom', ({username,room}) => {

        //client = socket.io client api
        //server = socket.io server api
        const user = userJoin(client.id,username,room);
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
        console.log("Hello world");
    })

    client.on('watcher', (roomName) => {
        console.log("hello world");
    })

    client.on('disconnect', () => {
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