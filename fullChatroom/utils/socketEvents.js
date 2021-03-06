const formatMessage = require('./messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers,getRooms, getUsernames,getUserBroadcaster} = require('./users');


const botName = "Reveille";

exports.socketEvents = async (client,server) => {
    server.emit("usersChange",getUsernames());
    client.on('joinRoom', ({username,room,isBroadcaster}) => {

        //First user to join room becomes the broadcaster
        if (getRoomUsers(room).length === 0) {
            isBroadcaster = true;
        }
        //client = socket.io client api
        //server = socket.io server api
        const user = userJoin(client.id,username,room,isBroadcaster);
        client.join(user.room);
        server.emit("usersChange",getUsernames());
        console.log(getUsernames());

        //Welcome new user
        client.emit('message',formatMessage(botName,'Welcome to Aggie Aux!'));

        //Broadcast when a user connects
        client.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //Send users and room info 
        server.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        if (getRoomUsers(room).length === 1) {
            server.emit("newRoom",getRooms());
        }
    });

    client.on('roomRequest', () => {
        server.emit("newRoom",getRooms());
    });

    

    //Use this to send a mesage to ALL clients
    //testing101
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
        if (user){
            server.to(user.room).emit('playbackState', state.state);
        }
    });

    client.on('seekEvent', (seekValue) => {
        console.log('seekevent',seekValue)
        const user = getCurrentUser(client.id);
        if (user){
            server.to(user.room).emit('seekEvent', seekValue);
        }
    });

    client.on('videoRequest', (vidLink) => {
        const user = getCurrentUser(client.id);
        if (user){
            server.to(user.room).emit('videoRequest', vidLink);
        }
    });

    client.on('getBvid',()=>{
        user = getCurrentUser(client.id);
        broadcaster = null
        if (!user.isBroadcaster){
            broadcaster = getUserBroadcaster(user)
            if (broadcaster){
            console.log("Bvid broadcaster",broadcaster.username)
            server.to(broadcaster.id).emit("getBvid", user);
            }
        }
        
    });

    client.on('seekReady',()=>{
        user = getCurrentUser(client.id);
        broadcaster = null
        if (!user.isBroadcaster){
            broadcaster = getUserBroadcaster(user)
            if (broadcaster){
            //console.log("Bvid broadcaster",broadcaster.username)
            server.to(broadcaster.id).emit("seekReady", user);
            }
        }
        
    });

    client.on('gotBvid',(user,videoId,timestamp)=>{
        console.log(videoId)
        //server.to(user.id).emit('videoRequest',videoId)
        //timestamp = Number(timestamp+Number(0))
        console.log(timestamp)
        server.to(user.id).emit('loadVideoAndTime',videoId,timestamp)
    })

    client.on('gotSeek',(user,timestamp)=>{
        //console.log(videoId)
        //server.to(user.id).emit('videoRequest',videoId)
        //timestamp = Number(timestamp+Number(0))
        //console.log(timestamp)
        server.to(user.id).emit('seekEvent',timestamp)
    })
    
    client.on('broadcaster', () => {
        console.log("Hello world1");
    })

    client.on('watcher', () => {
        console.log("hello world2");
        var currUsers = getRoomUsers(getCurrentUser(client.id).room);

        if (currUsers.length != 0) {
            currUsers.filter(user => user.isBroadcaster == true);
            client.to(currUsers[0].id).emit("watcher",client.id);
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
            if (theUserLeaving.isBroadcaster == true) {
                // server.emit("newRoom",getRooms());
            } else {
                let listUsers = getRoomUsers(theUserLeaving.room);
                let theBroadcaster = listUsers.find(theUserLeaving => ((theUserLeaving.isBroadcaster == true)));
                server.to(theBroadcaster).emit("disconnectPeer",client.id);
            }
        }

        const user = userLeave(client.id);

        if (user) {
            server.emit("usersChange",getUsernames());
            if (user.isBroadcaster) {
                server.emit("newRoom",getRooms());
            } else {
                server.to(user.room).emit('message',formatMessage(botName,`${user.username} just dipped. F.`));
                server.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });   
            }
        }
    });

};