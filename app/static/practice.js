// Tsun Ting (James) Wong - tw2686
// COMS 4170: User Interface Design
// Homework 12


var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var videoId = video.URL

var player, startTime,
time_update_interval = 0;

var loopLimit = 4;
var loopBool = false;
var toggle = false;
var loopStart = 0;
var loopEnd = 10;
var loop_id = 1;

var speedList;

$('#title').append(video.Name)

window.onbeforeunload = function(){
  var d = new Date();
  var endTime = d.getTime()
  var diff = Math.round((endTime - startTime)/1000) + video.TimeSpent
  var timeobj = {
    Id: vid_loops.Id,
    TimeSpent: diff
  }
  save_time(timeobj)
}

// Save video through ajax
var save_time = function(timeobj){
  var time_to_save = timeobj
  $.ajax({
    type: "POST",
    url: "save_time",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(time_to_save),
    success: function(result){
      var videos = result["videos"]
    },
    error: function(request, status, error){
      display_error()
      console.log("Error");
      console.log(request)
      console.log(status)
      console.log(error)
    }
  });
}


function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-placeholder', {
    width: '100%',
    height: '480',
    videoId: videoId,
    // videoId: '5mUgkqyyDY0',
    // origin: 'https://www.youtube.com',
    playerVars: {
      color: 'white'
    },
    events: {
      onReady: initialize,
      onStateChange: onPlayerStateChange
    }
  });
}


// Initialize Everything
function initialize(){
  var d = new Date();
  startTime = d.getTime()
  // Update the controls on load
  updateTimerDisplay();
  updateProgressBar();
  updateSlideBar();
  initSpeeds();
  bindKeyboardShorts();

  // Clear any old interval.
  clearInterval(time_update_interval);

  // loopStart interval to update elapsed time display and
  // the elapsed part of the progress bar every second.
  time_update_interval = setInterval(function () {
    updateTimerDisplay();
    updateProgressBar();
    checkForLoop(loopStart, loopEnd);

  }, 1000);

  // volume control
  $('#volume-input').val(Math.round(player.getVolume()));
}


// This function is called by initialize()
function updateTimerDisplay(){
  // Update current time text display.
  $('#current-time').text(formatTime( player.getCurrentTime() ));
  $('#duration').text(formatTime( player.getDuration() ));
}


// This function is called by initialize()
function updateProgressBar(){
  // Update the value of our progress bar accordingly.
  $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
}


// Progress bar
$('#progress-bar').on('mouseup touchend', function (e) {
  // Calculate the new time for the video.
  // new time in seconds = total duration in seconds * ( value of range input / 100 )
  var newTime = player.getDuration() * (e.target.value / 100);

  // Skip video to new time.
  player.seekTo(newTime);

});


// Update slide range bar at the start
function updateSlideBar(){
  $( "#slider-range" ).slider('option', {min:0, max: player.getDuration()});
}

// initialize slider-range
$( function() {
  $( "#slider-range" ).slider({
    range: true,
    values: [ 0, 10 ],
    slide: function( event, ui ) {
      var start = ui.values[0];
      var end = ui.values[1];
      if (toggle == true) {
        loopStart = start;
        loopEnd = end;
      }
      $('#loop-start').val(formatTime(start))
      $('#loop-end').val(formatTime(end))
    },
    change: function( event, ui ) {
      var start = ui.values[0];
      var end = ui.values[1];
      if (toggle == true) {
        loopStart = start;
        loopEnd = end;
      }
      $('#loop-start').val(formatTime(start))
      $('#loop-end').val(formatTime(end))
    }
  });
  $('#loop-start').val(formatTime($( "#slider-range" ).slider( "values", 0 )))
  $('#loop-end').val(formatTime($( "#slider-range" ).slider( "values", 1 )))
} );


function updateSliderRange(){
  var slide_s = $("#slider-range").slider('values')[0]
  var slide_e = $("#slider-range").slider('values')[1]
  var text_s = formatBack($("#loop-start").val())
  var text_e = formatBack($("#loop-end").val())
  if (slide_s != text_s || slide_e != text_e) {
    $("#slider-range").slider('option', {values: [text_s, text_e]})
  }
}

$("#loop-start").keypress(function(e) {
  if (e.which == 13) {
    event.preventDefault();
    updateSliderRange();
  }
});

$("#loop-end").keypress(function(e) {
  if (e.which == 13) {
    event.preventDefault();
    updateSliderRange();
  }
});

// initialize loop toggle click event
$('#loop-toggle').on('click', function () {
  var stopIcon = $("<ion-icon name='square'></ion-icon>");
  $('#limit_warning').empty();
  loopStart = $("#slider-range").slider('values')[0]
  loopEnd = $("#slider-range").slider('values')[1]
  $('.loopButts').not(this).removeClass('loop-active').text(function(){
    if ($(this).children().attr('name') == 'square') {
      var ntimes = $("<div class='smaller'>").text($(this).children().text());
      $(this).text($(this).attr('id')).append(ntimes);
      loopBool = false
    }
  })
  if (loopBool == false) {
    loopBool = true;
    toggle = true;
    player.seekTo(loopStart);
    player.playVideo();
    $(this).addClass('loop-active').text('').append(stopIcon);
  }
  else {
    loopBool = false;
    toggle = false;
    $(this).removeClass('loop-active').text('Loop');
  }
});


// check for loop end to repeat
function checkForLoop(loopStart, loopEnd){
  var curTime = player.getCurrentTime();
  if(loopBool == true && (curTime >= loopEnd || curTime < loopStart)){
    player.seekTo(loopStart);
    player.playVideo();
  }
}


// update the loops
var update_loops = function(vid_loops){
  loopBool = false;
  toggle = false;
  $('#loop-toggle').removeClass('loop-active').text('Loop');

  $("#loop_saves").empty();
  // var loopContainer = $("<div>");
  var stopIcon = $("<ion-icon class='mb-1' name='square'></ion-icon>");
  $.each(vid_loops, function(k, v){
    if (k != "Id") {
      var loopDiv = $("<div class='lb-wrap'>")

      var del_but = $("<button type='button' class='btn btn-warning btn-circle'>&times</button>");
      $(del_but).click(function(){
        $('#limit_warning').empty();
        var del_info = {
          vid_id: vid_loops.Id,
          loop_id: k
        }
        delete_loop(del_info);
      })
      $(loopDiv).append(del_but)

      var loopButton = $("<button type='button' class='btn btn-primary btn-xlarge m-2 loopButts'>");
      $(loopButton).attr('id', k)
      var st = v[0];
      var ed = v[1];
      var times = $("<div class='smaller'>").text(formatTime(st) + ' - ' + formatTime(ed))
      $(loopButton).append(k).append(times);
      $(loopButton).click(function(){
        $('#limit_warning').empty();
        $('.loopButts').not(this).removeClass('loop-active').text(function(){
          if ($(this).children().attr('name') == 'square') {
            var id = $(this).attr('id')
            if (id == "loop-toggle") {
              $(this).text("Loop")
              toggle = false;
            }
            else{
              var ntimes = $("<div class='smaller'>").text($(this).children().text())
              $(this).text(id).append(ntimes);
            }
            loopBool = false
          }
        })
        loopStart = st
        loopEnd = ed
        if (loopBool == false) {
          loopBool = true;
          player.seekTo(st);
          player.playVideo();
          $(this).addClass('loop-active').text('').append(stopIcon).append(times);
        }
        else {
          loopBool = false;
          $(this).removeClass('loop-active').text(k).append(times);
        }
      })

      $(loopDiv).append(loopButton)
      $("#loop_saves").append(loopDiv);
    }
  })
}

// check if loops of video is empty
if (!$.isEmptyObject(vid_loops)) {
  update_loops(vid_loops)
}


// save loop
$('#loop-save').on('click', function () {
  $('#limit_warning').empty();
  var start = $("#slider-range").slider('values')[0]
  var end = $("#slider-range").slider('values')[1]
  console.log(start, end)
  if (!$.isEmptyObject(vid_loops)){
    var length = Object.keys(vid_loops).length
    var largest = 1
    if (length > 1) {
      var largest_id = Object.keys(vid_loops)[length-1]
      var largest = parseInt(largest_id[largest_id.length-1])+1
    }
    if (length <= loopLimit) {
      var loop_id = 'L' + largest;
      var new_loop = {}
      new_loop[loop_id] = [start, end]
      var new_vid_loops = $.extend(vid_loops, new_loop)
      save_loop(new_vid_loops)
    }
    else {
      display_limit();
    }
  }
  else {
    var parts = $(location).attr('href').split("/");
    var last_part = parts[parts.length-1]
    var new_vid_loops = {
      Id: parseInt(last_part),
      l1: [start, end]
    }
    save_loop(new_vid_loops)
  }
});



// Save loop to database
var save_loop = function(new_loop){
  var data_to_save = new_loop
  $.ajax({
    type: "POST",
    url: "save_loop",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(data_to_save),
    success: function(result){
      vid_loops = result["new_vid_loops"]
      update_loops(vid_loops)
    },
    error: function(request, status, error){
      console.log("Error");
      console.log(request)
      console.log(status)
      console.log(error)
    }
  });
}

// delete loop
var delete_loop = function(del_info){
  var loop_to_del = del_info
  $.ajax({
    type: "POST",
    url: "del_loop",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(loop_to_del),
    success: function(result){
      vid_loops = result["new_vid_loops"]
      update_loops(vid_loops)
    },
    error: function(request, status, error){
      console.log("Error");
      console.log(request)
      console.log(status)
      console.log(error)
    }
  });
}

// display loop limit reached
var display_limit = function(){
  $('#limit_warning').val("");
  var warning = $("<a class='alert alert-warning'>");
  var msg = "Limit of " + loopLimit + " loops reached."
  $(warning).append(msg);
  $('#limit_warning').append(warning);
}

// Playback
$('#play-toggle').on('click', function(){
  var play_toggle = $(this);
  play_toggle.empty();
  var icon;
  var state = player.getPlayerState();
  if (state != 1) {
    icon = $('<ion-icon name="pause"></ion-icon>');
    player.playVideo();
  }
  else {
    icon = $('<ion-icon name="play"></ion-icon>');
    player.pauseVideo();
  }
  play_toggle.append(icon)
})


// On player state change make sure to change play button toggle
function onPlayerStateChange(event){
  if (event.data == YT.PlayerState.PLAYING) {
    var icon = $('<ion-icon name="pause"></ion-icon>');
    $('#play-toggle').children().replaceWith(icon)
  }
  else {
    var icon = $('<ion-icon name="play"></ion-icon>');
    $('#play-toggle').children().replaceWith(icon)
  }
}

// Sound volume
$('#mute-toggle').on('click', function() {
  var mute_toggle = $(this);
  mute_toggle.empty();
  if(player.isMuted()){
    player.unMute();
    var icon = $('<ion-icon name="volume-high"></ion-icon>')
    mute_toggle.append(icon)
  }
  else{
    player.mute();
    var icon = $('<ion-icon name="volume-mute"></ion-icon>')
    mute_toggle.append(icon);
  }
});

$('#volume-input').on('change', function () {
  player.setVolume($(this).val());
});


// initialize speeds
function initSpeeds(){
  speedList = player.getAvailablePlaybackRates()
  var index = speedList.indexOf(1)
  $('#slowdown').on('click', function(){
    if (index != 0) {
      index -= 1
      var speed = speedList[index]
      $('#speed').text(speed.toFixed(2))
      player.setPlaybackRate(speed);
    }
  })
  $('#speedup').on('click', function(){
    if (index != speedList.length) {
      index += 1
      var speed = speedList[index]
      $('#speed').text(speed.toFixed(2))
      player.setPlaybackRate(speed);
    }
  })
}

// forward video
function forward(){
  var curTime = player.getCurrentTime();
  player.seekTo(curTime + 1)
}

// backward video
function backward(){
  var curTime = player.getCurrentTime();
  player.seekTo(curTime - 1)
}

// front slider
function frontSliderFor(){
  var slide_s = $("#slider-range").slider('values')[0]
  var slide_e = $("#slider-range").slider('values')[1]
  $("#slider-range").slider('option', {values: [slide_s+1, slide_e]})
}
function frontSliderBack(){
  var slide_s = $("#slider-range").slider('values')[0]
  var slide_e = $("#slider-range").slider('values')[1]
  $("#slider-range").slider('option', {values: [slide_s-1, slide_e]})
}

// back slider
function backSliderFor(){
  var slide_s = $("#slider-range").slider('values')[0]
  var slide_e = $("#slider-range").slider('values')[1]
  $("#slider-range").slider('option', {values: [slide_s, slide_e+1]})
}
function backSliderBack(){
  var slide_s = $("#slider-range").slider('values')[0]
  var slide_e = $("#slider-range").slider('values')[1]
  $("#slider-range").slider('option', {values: [slide_s, slide_e-1]})
}

// quality
$('#quality').on('change', function () {
  player.setPlaybackQuality($(this).val());
});


// enable recordings stuff
$.getScript('/static/record.js');


// bind key board short cuts
function bindKeyboardShorts(){
  $(document).keydown(function(e){
    if (e.keyCode == 32){
      e.preventDefault();
      $("#play-toggle").click();
    }
    else if (e.keyCode == 39) {
      e.preventDefault();
      forward()
    }
    else if (e.keyCode == 37) {
      e.preventDefault();
      backward()
    }
    else if (e.keyCode == 77) {
      e.preventDefault();
      $('#mute-toggle').click();
    }
    else if (e.keyCode == 83) {
      e.preventDefault();
      $('#loop-save').click();
    }
    else if (e.keyCode == 76) {
      e.preventDefault();
      $('#loop-toggle').click();
    }
    else if (e.keyCode == 82) {
      e.preventDefault();
      if ($('#recordButton').is(':disabled')) {
        $('#stopButton').click();
      }
      else {
        $('#recordButton').click();
      }
    }
    else if (e.keyCode == 90) {
      e.preventDefault();
      if ($('#L1').length != 0)
      $('#L1').click();
    }
    else if (e.keyCode == 88) {
      e.preventDefault();
      if ($('#L2').length != 0)
      $('#L2').click();
    }
    else if (e.keyCode == 67) {
      e.preventDefault();
      if ($('#L3').length != 0)
      $('#L3').click();
    }
    else if (e.keyCode == 86) {
      e.preventDefault();
      if ($('#L4').length != 0)
      $('#L4').click();
    }
    else if (e.keyCode == 74) {
      e.preventDefault();
      $('#slowdown').click();
    }
    else if (e.keyCode == 75) {
      e.preventDefault();
      $('#speedup').click();
    }
    else if (e.keyCode == 85) {
      e.preventDefault();
      frontSliderBack();
    }
    else if (e.keyCode == 73) {
      e.preventDefault();
      frontSliderFor();
    }
    else if (e.keyCode == 79) {
      e.preventDefault();
      backSliderBack();
    }
    else if (e.keyCode == 80) {
      e.preventDefault();
      backSliderFor();
    }
  })
}

// Helper Functions
function formatTime(time){
  time = Math.round(time);
  var minutes = Math.floor(time / 60),
  seconds = time - minutes * 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return minutes + ":" + seconds;
}


function formatBack(time){
  var parts = time.split(':');
  var min = parseInt(parts[0])
  var sec = parseInt(parts[1])
  sec += min * 60
  return sec
}
