select = document.getElementById("room")
const socket = io();

socket.on('connect', () => {
    console.log(socket.id); // an alphanumeric id...
    socket.emit('roomRequest');
  });
socket.on('newRoom',(rooms)=>{
    console.log("newRoom",rooms)
    select.innerHTML= "";
    for (i of rooms){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        select.appendChild(opt);
    }
})



$('#chatRoomRedirectBroadcaster').hide();

$('#broadcastOptionsToggle').on('click', function() {
    $('#chatRoomRedirectBroadcaster').toggle();
} );

// $(function() {
//     $('#broadcastOptionsToggle').on('click', function() {
//         $('#chatRoomRedirectBroadcaster').toggle();
//     }); 
// });
