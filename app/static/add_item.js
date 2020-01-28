// Tsun Ting (James) Wong - tw2686
// COMS 4170: User Interface Design
// Final Project

// Get video id from URL
function getVideoId(url){
  var video_id = url.split('v=')[1];
  if (video_id == null) {
    return -1;
  }
  var ampersandPosition = video_id.indexOf('&');
  if(ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }
  return video_id
}

// Check for valid inputs
var check_input = function(){
  var name = $('#name').val();
  var url = getVideoId($('#url').val());
  var artist = $('#artist').val();
  var tuning = $('#tuning').val();

  if (name.length <= 0) {
    alert("Name Field was Empty");
    $('#name').focus();
  }
  else if (url == -1) {
    alert("URL Field was formatted incorrectly.");
    $('#url').focus();
  }
  else if (url.length <= 0) {
    alert("URL Field was Empty");
    $('#url').focus();
  }
  else if (artist.length <= 0) {
    alert("Artist Field was Empty");
    $('#artist').focus();
  }
  else if (tuning.length <= 0) {
    tuning = "NA"
    var new_video = {
      "Name": name,
      "URL": url,
      "Artist": artist,
      "Tuning": tuning
    }
    save_video(new_video)
  }
  else {
    var new_video = {
      "Name": name,
      "URL": url,
      "Artist": artist,
      "Tuning": tuning
    }
    save_video(new_video)
  }
}

// Save video through ajax
var save_video = function(new_video){
  var data_to_save = new_video
  $.ajax({
    type: "POST",
    url: "save_video",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(data_to_save),
    success: function(result){
      var videos = result["videos"]
      display_link(videos)
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

// display link if successful
var display_link = function(videos){
  $("#record_link").val("");
  var link = $("<a>Link to recently added video</a>")
  var id = videos.length
  $(link).attr("href", "/practice/" + id)
  $("#record_link").append(link)

  $("#name").val("");
  $("#url").val("");
  $("#artist").val("");
  $("#tuning").val("");

  $("#name").focus();
}

// display error if unsuccessful
var display_error = function(){
  $("#record_link").val("");
  var error = $("<a class='alert alert-danger'>Failed to add video to database.</a>")
  $("#record_link").append(error)
}

// Autocomplete video names
var update_names = function(videos){
  var videoNames = []
  $.each(videos, function(i, video){
    videoNames.push(video["Name"])
  });
  $( ".autovideos" ).autocomplete({
    source: videoNames
  });
}

// Wait for html to be ready
$(document).ready(function(){
  // Focus on videos input
  $("#name").focus();

  // Autocomplete videos
  update_names(videos);

  // Allow submission via enter
  $("#tuning").keypress(function(e) {
    if (e.which == 13) {
      event.preventDefault();
      check_input();
    }
  });

  // Create click events for submit button
  $("#submit").on('click', check_input);

})
