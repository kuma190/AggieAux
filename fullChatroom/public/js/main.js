//Front end Javascript (client side)
//We have access to this io because we added a script tag to the chat.html file

const  chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from URL
let {username, room, newRoom,usernameBC } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


if (room == undefined) {
    room = newRoom;
}
console.log("Room",room);

if (username == undefined){
    username = usernameBC
}
console.log("Username",username)


//Join chatroom

let isBroadcaster = false;
socket.emit('joinRoom', {username,room,isBroadcaster});

//Get room and users
socket.on('roomUsers', ({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
});


//Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//Mesage submit
chatForm.addEventListener('submit', (e) => {
    //prevent default behavior
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage', msg);

    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();


})

//Output message to DOM 
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM 
function outputRoomName(room) {
    roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join("")}
    `
}