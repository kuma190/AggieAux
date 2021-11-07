
const socket = io.connect();

//receiving a message
socket.on('message', text => {

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)

});



//Collecting and using username
document.querySelector('#userButton').onclick = () => {
    const text = document.querySelector('#enterUser').value;
    socket.emit('theUserName',text);
}
//sending a message
document.querySelector('button').onclick = () => {

    const text = document.querySelector('input').value;
    socket.emit('message', text)
    
}

// Regular Websockets

// const socket = new WebSocket('ws://localhost:8080');

// // Listen for messages
// socket.onmessage = ({ data }) => {
//     console.log('Message from server ', data);
// };

// document.querySelector('button').onclick = () => {
//     socket.send('hello');
// }