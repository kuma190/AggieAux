//const { Server } = require("socket.io");
theRooms = []
Usernames = []
select = document.getElementById("room")
create = document.getElementById("newRoom")
broadcaster = document.getElementById("usernameBC")
user = document.getElementById("username")
const socket = io();

function checkUniqueRoomAndBroadcaster(){    
  
      if (theRooms.includes(create.value) || Usernames.includes(broadcaster.value)){
        alert('Form submission cancelled.');
        return false;
      }
  
  // actual logic, e.g. validate the form
  
}

function checkUniqueUser(){
    if (Usernames.includes(user.value)){
        alert('Form submission cancelled.');
        return false;
    }
}

  

socket.on('connect', () => {
    console.log(socket.id); // an alphanumeric id...
    socket.emit("requestRooms")
    
  });
socket.on('newRoom',(rooms)=>{
    console.log("newRoom",rooms)
    theRooms = rooms
    select.innerHTML= "";
    for (i of rooms){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        select.appendChild(opt);
    }
})
socket.on('usersChange',(usernames)=>{
    console.log(usernames)
    Usernames = usernames
})



