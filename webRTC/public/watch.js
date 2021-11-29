let peerConnection;
const config = {
  iceServers: [
      { 
        "urls": "stun:stun.l.google.com:19302",
      },
      { 
        "urls": "turn:3.12.34.87:3478?transport=tcp",
        "username": "root",
        "credential": "user"
      }
  ]
};

const socket = io.connect(window.location.origin);
const video = document.querySelector("video");
const enableAudioButton = document.querySelector("#enable-audio");

enableAudioButton.addEventListener("click", enableAudio)

socket.on('connect', () => {
  console.log(socket.id); // an alphanumeric id...
  socket.emit("requestRooms")
});

socket.on("requestRooms", (rooms) =>{
  console.log("roomOptions",rooms)
});

socket.on('broadcastDC', (id) => {
  console.log("disconnected",id); //an alphanumeric id...
});

socket.on("offer", (id, description) => {
  console.log("offer",id)
  peerConnection = new RTCPeerConnection(config);
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("answer", id, peerConnection.localDescription);
    });
  peerConnection.ontrack = event => {
    video.srcObject = event.streams[0];
  };
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };
});


socket.on("candidate", (id, candidate) => {
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

async function getRoomNo(){
  roomNo = document.getElementById("roomNo").value
  console.log("getRoom", roomNo)
  
    socket.emit("watcher",roomNo);
}


// socket.on("broadcaster", () => {
//   socket.emit("watcher");
// });

window.onunload = window.onbeforeunload = () => {
  socket.close();
  peerConnection.close();
};

function enableAudio() {
  console.log("Enabling audio")
  video.muted = false;
}