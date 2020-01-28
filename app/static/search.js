// Tsun Ting (James) Wong - tw2686
// COMS 4170: User Interface Design
// Final Project

// Check for valid inputs
var check_input = function(){
  $("#videos").empty();
  var input = $("#lookup").val().toLowerCase();
  var relevant = []
  $.each(videos, function(i, obj){
    var values = Object.values(obj)
    $.each(obj, function(k, v){
      if (k != "Id" && k != "URL"){
        var compare = v.toString().toLowerCase()
        if (compare.indexOf(input) != -1){
          relevant.push(obj)
          return false;
        }
      }
    })
  });
  display_videos(relevant)
}

// Display video images in explore page
var display_videos = function(videos){
  var grid = $("<div>")
  var k = 0
  var len = Math.ceil(videos.length/3)
  for (var i = 0; i < len; i++) {
    var row = $("<div class='row'>")
    for (var j = 0; j < 3; j++) {
      if (j+k < videos.length) {
        var vid = videos[j+k]
        var col = $("<div class='col-md-4'>")
        var card = $("<a class='card'>").attr('href', '/practice/' + vid.Id)
        var img_src = "http://i3.ytimg.com/vi/" + vid.URL + "/hqdefault.jpg"
        var thumb = $("<img class='card-img-top'>").attr("src", img_src)
        var card_bod = $("<div class='card-body'>")
        var card_txt = $("<p class='card-text'>").append(vid.Name)

        $(card_bod).append(card_txt)
        $(card).append(thumb).append(card_bod)
        $(col).append(card)
        $(row).append(col)
      }
    }
    k += 3
    $(grid).append(row).append("<br>")
  }
  $("#videos").append(grid)
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

  // Focus on brands input
  $("#lookup").focus();

  // Autocomplete videos
  update_names(videos);

  // Check input first
  $("#lookup").val(input);
  check_input()

  // Allow submission via enter
  $("#lookup").keypress(function(e) {
    if (e.which == 13) {
      event.preventDefault();
      check_input();
    }
  });

  // Create click events for submit button
  $("#submit").on('click', check_input);

})
