const formatMessage = require('./messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./users');


const botName = "Reveille";

exports.socketEvents = async (client,server) => {
    client.on('joinRoom', ({username,room}) => {

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

    client.on('videoMessage', (state) => {
        const user = getCurrentUser(client.id);
        server.to(user.room).emit('videoMessage', state.state);
        });

    

    client.on('disconnect', () => {
        const user = userLeave(client.id);

        if (user) {
            server.to(user.room).emit('message',formatMessage(botName,`${user.username} just dipped. F.`));

        }

        //Send list of users and room info when a new user joins to update info
        server.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

};