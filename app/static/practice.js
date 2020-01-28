// Tsun Ting (James) Wong - tw2686
// COMS 4170: User Interface Design
// Homework 11


// $(document).ready(function(){


// 2. This code loads the IFrame Player API code asynchronously.
// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var time_update_interval = 0;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'V3cEhbO9Kv8',
    playerVars: {
      color: 'white'
    },
    events: {
      // 'onReady': onPlayerReady,
      'onReady': initialize
      // 'onStateChange': onPlayerStateChange
    }
  });
}
// function onYouTubeIframeAPIReady() {
//   player = new YT.Player('player', {
//     events: {
//       'onReady': initialize
//     }
//   });
// }

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

function initialize(){
  // Update the controls on load
  updateTimerDisplay();
  // updateProgressBar();

  // Clear any old interval.
  clearInterval(time_update_interval);

  // Start interval to update elapsed time display and
  // the elapsed part of the progress bar every second.
  time_update_interval = setInterval(function () {
    updateTimerDisplay();
    // updateProgressBar();
  }, 1000);


}

// This function is called by initialize()
function updateTimerDisplay(){
  // Update current time text display.
  $('#current-time').text(formatTime( player.getCurrentTime() ));
  $('#duration').text(formatTime( player.getDuration() ));
}

function formatTime(time){
  time = Math.round(time);

  var minutes = Math.floor(time / 60),
  seconds = time - minutes * 60;

  seconds = seconds < 10 ? '0' + seconds : seconds;

  return minutes + ":" + seconds;
}

// $('#play').on('click', function () {
//   // console.log("play");
//   player.playVideo();
// });

$('#pause').on('click', function () {
  console.log("pause")
  player.pauseVideo();
});

// $('#progress-bar').on('mouseup touchend', function (e) {
//
//   // Calculate the new time for the video.
//   // new time in seconds = total duration in seconds * ( value of range input / 100 )
//   var newTime = player.getDuration() * (e.target.value / 100);
//
//   // Skip video to new time.
//   player.seekTo(newTime);
//
// });
//
// // This function is called by initialize()
// function updateProgressBar(){
//   // Update the value of our progress bar accordingly.
//   $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
// }

// $('#mute-toggle').on('click', function() {
//   var mute_toggle = $(this);
//
//   if(player.isMuted()){
//     player.unMute();
//     mute_toggle.text('volume_up');
//   }
//   else{
//     player.mute();
//     mute_toggle.text('volume_off');
//   }
// });

// $('#volume-input').on('change', function () {
//   player.setVolume($(this).val());
// });

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
// var done = false;
// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.PLAYING && !done) {
//     setTimeout(stopVideo, 6000);
//     done = true;
//   }
// }
// function stopVideo() {
//   player.stopVideo();
// }


// Wait for html to be ready
// $(document).ready(function(){
//
//
  // $('#stop').on('click', function() {
  //   //$('#popup-youtube-player').stopVideo();
  //   $('#player')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
  // });
//
// })
