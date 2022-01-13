const socket = io();
var tag = document.createElement('script');
var progressBar = document.getElementById("progress-bar")

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0]; 
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var videoId = '6h7T_zbPGBw'

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '490',
      width: '600',
      videoId: videoId,
      playerVars: {
        'modestbranding': 1,
        'controls': 0,
        'disablekb': 1,
        'rel': 0,
        'showinfo': 0

      },
      origin: "http://example.com",
      events: {
        'onReady': initialization,

      }
    });
  }
  
  function initialization() { 
    socket.emit("getBvid")
    $('#play').on('click', () => {
      player.getPlayerState() === 0 ? player.seekTo(0) : null;
      player.playVideo()
      socket.emit('playbackState', {
        state: true
      });
    });

    $('#pause').on('click', () => {
      player.pauseVideo();
      socket.emit('playbackState', {
        state: false
      });
    });

    $('#progress-bar')
      .attr('min',0)
      .attr('max',player.getDuration())
      .on('mouseup touchend', (e) => {
        player.seekTo(Number(e.target.value) + Number (0));
        socket.emit('seekEvent',Number(e.target.value) + Number(0));
      });

    $('#vidSend').on('click', (e) => {
      e.preventDefault();

      const vidLink = $('#vidRequest').val();

      const videoId = youtube_parser(vidLink);
      // const videoId = vidLink;
      console.log(videoId);


      //emit to server
      socket.emit('videoRequest', videoId);


      //clear field
      $('#vidRequest').val('');
    });
    
      player.seekTo(0);
      //socket.emit("getBvid")

      doUpdate();

      let updateInterval = setInterval(() => {
        doUpdate();
      },500);
    
  }

  function doUpdate() {
    updateTimerDisplay();
    updateProgressBar();

  }

  function updateTimerDisplay() {
    $('#current-time').text(formatTime(Number(player.getCurrentTime()) - Number(0)));
    $('#duration').text(formatTime(player.getDuration()));
  }

  function formatTime(time) {

    time = Math.round(time);
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
  }

  function updateProgressBar() {
    $('#progress-bar').val(player.getCurrentTime() - 0);
    $('#progress-bar').attr('min',0);
    $('#progress-bar').attr('max',player.getDuration());
  }


  //VERY IMPORTANT in order for request video funcitonality to work.
  //The following function parses the watch-id from a youtube link, since YouTube IFRAME API's 
  //loadVideoByUrl() requires the following format:
  //http://www.youtube.com/v/VIDEO_ID?version=3
  function youtube_parser(url){
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return false
    }
}

  function playVideo() {
    player.playVideo();
  }

  function pauseVideo() {
      player.pauseVideo();
  }

  function stopVideo() {
      player.stopVideo();
  }


/////     YouTube Stuff   /////////
// socket.on('videoMessage', (state) => {
//   console.log("please work i swear");
//   state ? playVideo() : pauseVideo();
//   });

socket.on('playbackState', (state) => {
  console.log("help me pls");
  state ? playVideo() : pauseVideo()
});

socket.on('seekEvent', (seekValue) => {
  player.seekTo(seekValue);
});

socket.on('videoRequest', (vidLink) => {
  // if (vidLink.length != 11){
  //   vidLink = youtube_parser(vidLink)
  // }
  console.log('Load new video');
  player.loadVideoById(vidLink);
  console.log("here");
  console.log(player.getDuration());
})

socket.on('loadVideoAndTime',(vidLink,timestamp)=>{
  console.log('loadVideoandtime');
  if (vidLink.length != 11){
       vidLink = youtube_parser(vidLink)
   }
   //videoId = vidLink
   //onYouTubeIframeAPIReady()
   console.log(vidLink,timestamp)
  player.loadVideoById(vidLink,timestamp)
  //player.seekTo(timestamp)
  //progressBar.max = player.getDuration()
    
    setTimeout(function(){ 
      console.log('sleep 500',Number(progressBar.value) + Number(0),player.getDuration()); 
      //socket.emit('seekEvent',Number(progressBar.value) + Number(0));
      socket.emit('seekEvent',timestamp+0.5);
      //socket.emit("seekReady") //this tries to get a timestamp from broadcaster after user video is laoded, but the sync is eh
  }, 750); 
  //socket.emit('seekEvent',Number(timestamp) + Number(0));

})

socket.on('getBvid',(user)=>{
  console.log(user.username)
  videoUrl = player.getVideoUrl()
  //timestamp = Number(progressBar.value) + Number (0)
  timestamp = Number(progressBar.value)+Number(0)
  console.log(timestamp)
  console.log(videoUrl)
  socket.emit("gotBvid",user,videoUrl,timestamp)
})

//not used unless seekready is called above
socket.on('seekReady',(user)=>{
  console.log(user.username)
  //videoUrl = player.getVideoUrl()
  //timestamp = Number(progressBar.value) + Number (0)
  timestamp = Number(progressBar.value) + Number(0)
  //console.log(timestamp)
  //console.log(videoUrl)
  socket.emit("gotSeek",user,timestamp)
})
