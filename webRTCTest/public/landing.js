const socket = io.connect(window.location.origin);
const video = document.querySelector("video");
roomlist = document.getElementById("ListOfRooms")

function gotowatcher(){
    
}
socket.on('connect', () => {
    console.log(socket.id); // an alphanumeric id...
    socket.emit("requestRooms")
  });
  
  socket.on("requestRooms", (rooms) =>{
    console.log("roomOptions",rooms)
    //roomlist.innerHTML = ""
    element = ""
    for (key in rooms){
        id = rooms[key]["room"]
        element += "<li onclick = 'gotowatcher()' id = '"+key+"'>Room "+ id+"</li>"
    }
    roomlist.innerHTML = element

  });
