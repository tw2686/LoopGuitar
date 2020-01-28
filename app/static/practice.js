// Tsun Ting (James) Wong - tw2686
// COMS 4170: User Interface Design
// Final Project

// Link YouTube iframe API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Initialize relavant variables
var player, startTime,
time_update_interval = 0;

var loopLimit = 5;
var loopBool = false;
var toggle = false;
var loopStart = 0;
var loopEnd = 10;
var loop_id = 1;

var speedList;

// Calculate time spent on page whenever it is exited
window.onbeforeunload = function(){
  var d = new Date();
  var endTime = d.getTime()
  var diff = Math.round((endTime - startTime)/1000) + video.TimeSpent
  var timeobj = {
    Id: video.Id,
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

// Set YouTube API properties
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-placeholder', {
    width: '100%',
    height: '45%',
    videoId: video.URL,
    playerVars: {
      color: 'white',
      controls: 0
    },
    events: {
      onReady: initialize,
      onStateChange: onPlayerStateChange
    }
  });
}

// Initialize all video/loop related features
function initialize(){
  var d = new Date();
  startTime = d.getTime()

  updateTimerDisplay();
  updateProgressBar();
  updateSlideBar();
  initSpeeds();
  initializeLoops();
  bindKeyboardShorts();
  initInputRanges();

  // Initialize Tooltips
  $(function () {
    $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'})
  })

  // Hide Navbar
  $('.navbar').hide()
  $(document).on('mousemove', function(e) {
    if (e.pageY < 10) {
      $('.navbar').slideDown();
    }
    else if (e.pageY > 100) {
      $('.navbar').slideUp();
    }
  })
  if (video.Tuning != "NA") {
    $('#tuning').append(video.Tuning)
  }

  // Clear any old interval.
  clearInterval(time_update_interval);

  // Update relavant functions at each time interval
  time_update_interval = setInterval(function () {
    updateTimerDisplay();
    updateProgressBar();
    checkForLoop(loopStart, loopEnd);
  }, 1000);
}


// Updates timer display
function updateTimerDisplay(){
  $('#current-time').text(formatTime( player.getCurrentTime() ));
  $('#duration').text(formatTime( player.getDuration() ));
}

// Updates progress bar
function updateProgressBar(){
  $("#progress-bar").slider('value', (player.getCurrentTime() / player.getDuration()) * 100);
}

// Initialize slider properties of slider bar
$( function() {
  $( "#progress-bar" ).slider({
    range: 'min',
    min: 1,
    slide: function( event, ui ) {
      var curTime = ui.value
      var newTime = player.getDuration() * (curTime / 100);
      $('#current-time').text(formatTime( newTime ));
      player.seekTo(newTime);
    }
  });
});

// Initialize nstSlider properties for loop bar
$('.nstSlider').nstSlider({
  "left_grip_selector": ".leftGrip",
  "right_grip_selector": ".rightGrip",
  "value_bar_selector": ".bar",
  "value_changed_callback": function(cause, leftValue, rightValue) {
    var $container = $(this).parent();
    if (toggle == true) {
      loopStart = leftValue;
      loopEnd = rightValue;
    }
    $container.find('.leftLabel').text(leftValue);
    $container.find('.rightLabel').text(rightValue);
    $('#loop-start').val(formatTime(leftValue));
    $('#loop-end').val(formatTime(rightValue));
  },
  "highlight": {
    "grip_class": "gripHighlighted",
    "panel_selector": ".highlightPanel"
  }
});


// Updates loop range min and max
function updateSlideBar(){
  $('.nstSlider').nstSlider('set_range', 0, player.getDuration());
  $('.nstSlider').nstSlider('refresh');
}

// Updates loop range left and right grips based on range input values
function updateSliderRange(){
  var slide_s = $(".nstSlider").nstSlider("get_current_min_value")
  var slide_e = $(".nstSlider").nstSlider("get_current_max_value")
  var text_s = formatBack($("#loop-start").val())
  var text_e = formatBack($("#loop-end").val())
  if (slide_s != text_s || slide_e != text_e) {
    $(".nstSlider").nstSlider("set_position", text_s, text_e);
  }
}

  // Call update slider if input loop-start/end is entered
function initInputRanges(){
  $("#loop-start, #loop-end").focus(function(){
    $(document).unbind('keydown');
  }).keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      updateSliderRange();
    }
  }).blur(function(){
    bindKeyboardShorts();
  });

}

// Initalize Loop restart
$('#loop-restart').on('click', backloopStart);

// Initialize loop toggle click event
$('#loop-toggle').on('click', function () {
  var stopIcon = $("<ion-icon name='square'></ion-icon>");
  $('#limit_warning').empty();
  loopStart = $(".nstSlider").nstSlider("get_current_min_value")
  loopEnd = $(".nstSlider").nstSlider("get_current_max_value")
  $('.loopButts').not(this).removeClass('loop-active').text(function(){
    if ($(this).children().attr('name') == 'square') {
      var ntimes = $("<div class='smaller'>").text($(this).children().text());
      $(this).text($(this).attr('id')).append(ntimes);
      loopBool = false
      $('#loop-restart').prop('disabled', true)
    }
  })
  if (loopBool == false) {
    loopBool = true;
    $('#loop-restart').prop('disabled', false)
    toggle = true;
    player.seekTo(loopStart);
    player.playVideo();
    $(this).addClass('loop-active').text('').append(stopIcon);
    $('.nstSlider').nstSlider('highlight_range', loopStart, loopEnd);
    $('.nstSlider .highlightPanel').css({'background': '#3CE0AF'});
    $(this).attr('data-original-title', 'Stop Loop (l)');
  }
  else {
    loopBool = false;
    toggle = false;
    $('#loop-restart').prop('disabled', true)
    player.pauseVideo()
    $(this).removeClass('loop-active').text('Loop');
    $('.nstSlider').nstSlider('highlight_range');
    $('.nstSlider .highlightPanel').css({'background': 'rgb(255, 255, 102, 0)'});
    $(this).attr('data-original-title', 'Begin Loop (l)');
  }
});


// Checks for loop end to replay loop
function checkForLoop(loopStart, loopEnd){
  var curTime = player.getCurrentTime();
  if(loopBool == true){
    $('.nstSlider').nstSlider('highlight_range', loopStart, loopEnd);
    if (curTime >= loopEnd || curTime < loopStart) {
      player.seekTo(loopStart);
      player.playVideo();
    }
  }
}


// Updates the display of all loops
var update_loops = function(vid_loops){
  loopBool = false;
  toggle = false;
  $('#loop-restart').prop('disabled', true)
  $('.nstSlider').nstSlider('highlight_range');
  $('.nstSlider .highlightPanel').css({'background': 'rgb(255, 255, 102, 0)'})
  $('#loop-toggle').removeClass('loop-active').text('Loop');

  $("#loop_saves").empty();

  var keybinds = ['(q)', '(w)', '(e)', '(r)', '(t)']
  var keyI = 0;
  var stopIcon = $("<ion-icon class='mb-1' name='square'></ion-icon>");
  $.each(vid_loops, function(k, v){
    if (k != "Id") {
      var loop_name = v[0];
      var st = v[1];
      var ed = v[2];
      var loopDiv = $("<div class='lb-wrap'>")

      var del_but = $("<button type='button' class='btn btn-danger btn-delete'>&times</button>");
      var edit_icon = $("<ion-icon class='small' name='create'>")
      var edit_but = $("<button type='button' class='btn btn-warning btn-edit' data-toggle='modal' data-target='#myModal'>");
      $(edit_but).append(edit_icon);
      $(edit_but).attr('data-info', loop_name);
      $(edit_but).attr('data-id', k);
      $(del_but).click(function(){
        $('#limit_warning').empty();
        var del_info = {
          vid_id: vid_loops.Id,
          loop_id: k
        }
        delete_loop(del_info);
      })
      $(loopDiv).append(del_but).append(edit_but);
      var loopButton = $("<button type='button' class='btn btn-primary btn-xlarge m-2 loopButts' data-toggle='tooltip'>");
      $(loopButton).attr('id', loop_name)
      $(loopButton).attr('data-original-title', k + ' ' + keybinds[keyI]).tooltip({trigger: 'hover'})
      keyI += 1;

      var times = $("<div class='smaller'>").text(formatTime(st) + ' - ' + formatTime(ed))
      $(loopButton).append(loop_name).append(times);
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
            $('#loop-restart').prop('disabled', true)
          }
        })
        loopStart = st
        loopEnd = ed
        if (loopBool == false) {
          loopBool = true;
          $('#loop-restart').prop('disabled', false)
          player.seekTo(st);
          player.playVideo();
          $(this).addClass('loop-active').text('').append(stopIcon).append(times);
          $('.nstSlider').nstSlider('highlight_range', loopStart, loopEnd);
          $('.nstSlider .highlightPanel').css({'background': '#3CE0AF'})
        }
        else {
          loopBool = false;
          $('#loop-restart').prop('disabled', true)
          player.pauseVideo()
          $(this).removeClass('loop-active').text(loop_name).append(times);
          $('.nstSlider').nstSlider('highlight_range');
          $('.nstSlider .highlightPanel').css({'background': 'rgb(255, 255, 102, 0)'})
        }
      })

      $(loopDiv).append(loopButton)
      $("#loop_saves").append(loopDiv);
    }
  })
  $('#myModal').on('show.bs.modal', function (event) {
    $(document).unbind('keydown');
    var but = $(event.relatedTarget);
    var info = but.data('info');
    var id = but.data('id');
    var modal = $(this);
    modal.find('.modal-body input').val(info);
    modal.find('.modal-footer #renamesubmit').on('click', function() {
      var newname = modal.find('.modal-body input').val();
      var new_vid_loops = $.extend(true, {}, vid_loops);
      new_vid_loops[id][0] = newname;
      save_loop(new_vid_loops);
    })
  })
  $('#myModal').on('hidden.bs.modal', function(event){
    bindKeyboardShorts()
  })
}

// Checks if loops of video from flask is empty
function initializeLoops(){
  if (!$.isEmptyObject(vid_loops)) {
    update_loops(vid_loops);
  }
}

// Initialize loop save button
$('#loop-save').on('click', function () {
  $('#limit_warning').empty();
  var start = $(".nstSlider").nstSlider("get_current_min_value")
  var end = $(".nstSlider").nstSlider("get_current_max_value")
  console.log(start, end)
  player.pauseVideo()
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
      new_loop[loop_id] = ["Loop" + largest, start, end]
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
      L1: ["Loop1", start, end]
    }
    save_loop(new_vid_loops)
  }
});


// Save loop to database using AJAX
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

// Delete loop from database
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

// Display loop limit warning when reached
var display_limit = function(){
  $('#limit_warning').val("");
  var warning = $("<div class='alert alert-warning alert-dismissible fade show'>");
  var msg = "Limit of " + loopLimit + " loops reached.";
  var close_but = $("<button type='button' class='close' data-dismiss='alert' aria-label='Close'>");
  var span = $('<span aria-hidden="true">&times;</span>');
  $(close_but).append(span);
  $(warning).append(msg);
  $(warning).append(close_but);
  $('#limit_warning').append(warning);
}

// Initalize play toggle button
$('#play-toggle').on('click', function(){
  var play_toggle = $(this);
  play_toggle.empty();
  var icon;
  var state = player.getPlayerState();
  if (state != 1) {
    icon = $('<ion-icon name="pause"></ion-icon>');
    play_toggle.attr('data-original-title', 'Pause (space)');
    player.playVideo();
  }
  else {
    icon = $('<ion-icon name="play"></ion-icon>');
    play_toggle.attr('data-original-title', 'Play (space)');
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

// Initialize mute toggle button
$('#mute-toggle').on('click', function() {
  var mute_toggle = $(this);
  mute_toggle.empty();
  if(player.isMuted()){
    player.unMute();
    var icon = $('<ion-icon name="volume-high"></ion-icon>')
    mute_toggle.attr('data-original-title', 'Mute (m)');
    mute_toggle.append(icon)
  }
  else{
    player.mute();
    var icon = $('<ion-icon name="volume-mute"></ion-icon>');
    mute_toggle.attr('data-original-title', 'Unmute (m)');
    mute_toggle.append(icon);
  }
});


// Initialize speeds controls of video
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

// forward video by one second
function forward(){
  var curTime = player.getCurrentTime();
  player.seekTo(curTime + 1)
}

// backward video by one second
function backward(){
  var curTime = player.getCurrentTime();
  player.seekTo(curTime - 1)
}

// front slider controls
function frontSliderFor(){
  var slide_s = $(".nstSlider").nstSlider("get_current_min_value")
  var slide_e = $(".nstSlider").nstSlider("get_current_max_value")
  $(".nstSlider").nstSlider("set_position", slide_s+1, slide_e);
}
function frontSliderBack(){
  var slide_s = $(".nstSlider").nstSlider("get_current_min_value")
  var slide_e = $(".nstSlider").nstSlider("get_current_max_value")
  $(".nstSlider").nstSlider("set_position", slide_s-1, slide_e);
}

// back slider controls
function backSliderFor(){
  var slide_s = $(".nstSlider").nstSlider("get_current_min_value")
  var slide_e = $(".nstSlider").nstSlider("get_current_max_value")
  $(".nstSlider").nstSlider("set_position", slide_s, slide_e+1);
}
function backSliderBack(){
  var slide_s = $(".nstSlider").nstSlider("get_current_min_value")
  var slide_e = $(".nstSlider").nstSlider("get_current_max_value")
  $(".nstSlider").nstSlider("set_position", slide_s, slide_e-1);
}


// bind key board short cuts
function bindKeyboardShorts(){
  $(document).keydown(function(e){
    e.stopImmediatePropagation();
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
    else if (e.keyCode == 81) {
      e.preventDefault();
      if ($('#L1').length != 0)
      $('#L1').click();
    }
    else if (e.keyCode == 87) {
      e.preventDefault();
      if ($('#L2').length != 0)
      $('#L2').click();
    }
    else if (e.keyCode == 69) {
      e.preventDefault();
      if ($('#L3').length != 0){
        $('#L3').click();
      }
    }
    else if (e.keyCode == 82) {
      e.preventDefault();
      if ($('#L4').length != 0)
      $('#L4').click();
    }
    else if (e.keyCode == 84) {
      e.preventDefault();
      if ($('#L5').length != 0)
      $('#L5').click();
    }
    else if (e.keyCode == 72) {
      e.preventDefault();
      $('#slowdown').click();
    }
    else if (e.keyCode == 74) {
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
    else if (e.keyCode == 75) {
      e.preventDefault();
      $('#shortcutsButton').click();
    }
    else if (e.keyCode == 86) {
      e.preventDefault();
      backloopStart();
    }
    else if (e.keyCode == 67) {
      e.preventDefault();
      $('#checkProgress').click()
    }
  })
}

// back to beginning of loop
function backloopStart(){
  var curTime = player.getCurrentTime();
  if(loopBool == true){
    player.seekTo(loopStart);
    player.playVideo();
  }
}

// Format time from js values to min:sec
function formatTime(time){
  time = Math.round(time);
  var minutes = Math.floor(time / 60),
  seconds = time - minutes * 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return minutes + ":" + seconds;
}

// Format time from min:sec to js values
function formatBack(time){
  var parts = time.split(':');
  var min = parseInt(parts[0])
  var sec = parseInt(parts[1])
  sec += min * 60
  return sec
}

// Check progress button click event
$('#checkProgress').click(function(){
  window.location = '/progress'
})
