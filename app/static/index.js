// Tsun Ting (James) Wong - tw2686
// COMS 4170: User Interface Design
// Homework 12


// Wait for html to be ready
$(document).ready(function(){

  $('#layoutcontainer').hide()
  $('nav').removeClass('bg-dark')
  // Focus on brands input
  $("#lookup").focus();

  // Allow submission via enter
  $("#lookup").keypress(function(e) {
    if (e.which == 13) {
      event.preventDefault();
      var input = $("#lookup").val()
      $(location).attr('href', '/search?lookup=' + input)
    }
  });

  // Create click events for submit button
  $('#submit').click(function(event) {
    event.preventDefault();
    var input = $("#lookup").val()
    $(location).attr('href', '/search?lookup=' + input)
  });

})
