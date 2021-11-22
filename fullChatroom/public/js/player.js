const socket = io();
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0]; 
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player; 
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'XqpQpt_cmhE',
      playerVars: {
        'modestbranding': 1,
        'controls': 1,
        'allowfullscreen': 1,
        'fs': 1,
        'autoplay': true,
        'rel': 0,
        'showinfo': 0

      },
      origin: "http://example.com",
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }


  function onPlayerReady(event) {
      // event.target.playVideo();
      console.log("ready");

  }

  function onPlayerStateChange(event) {
      console.log("playerchange");
      socket.emit('messTest',"Hellooooo");
      switch (event.data) {
          case 1:
            //   socket.emit('message',"hello");
              playVideo();
              socket.emit('videoMessage', {
                state: true
              });
              break;
          case 2:
              pauseVideo();
              socket.emit('videoMessage', {
                state:false
              });
              break;
      }
  }

  function playVideo() {
      player.seekTo(30)
      setTimeout(player.PlayVideo,5);
  }

  function pauseVideo() {
      player.pauseVideo();
  }

  function stopVideo() {
      player.stopVideo();
  }


/////     YouTube Stuff   /////////
socket.on('videoMessage', (state) => {
  console.log("please work i swear");
  state ? playVideo() : pauseVideo();
  });
