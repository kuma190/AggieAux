const socket = io();
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0]; 
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player; 
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '490',
      width: '600',
      videoId: '6h7T_zbPGBw',
      playerVars: {
        'modestbranding': 1,
        'controls': 0,
        'disablekb': 1,
        'rel': 0,
        'showinfo': 0

      },
      origin: "http://example.com",
      events: {
        'onReady': () => initialization(),

      }
    });
  }
  
  function initialization() { 

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
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
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
  console.log('Load new video');
  player.loadVideoById(vidLink);
  console.log("here");
  console.log(player.getDuration());
})
