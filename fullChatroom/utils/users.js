const users = [];


//Add new user to list of users
function userJoin(id,username,room,isBroadcaster) {
    const user = {id,username,room,isBroadcaster};

    users.push(user);

    return user;
}

//Get current user
function getCurrentUser(id) {
    //reminds me of haskell :D
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        if (users.at(index).isBroadcaster) {
            console.log("Broadcaster is leaving");
        }
        return users.splice(index,1)[0];
    }
}

//Get current users
function getRoomUsers(room) {
    return users.filter(user=> user.room === room);
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}