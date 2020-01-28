// Tsun Ting (James) Wong - tw2686
// COMS 4170: User Interface Design
// Homework 8

// Check for valid inputs
var check_input = function(){
  var input = $("#lookup").val().toLowerCase();
  $("#results").empty();
  $.each(brands, function(i, obj){
    var values = Object.values(obj)
    var relevant = []
    $.each(obj, function(k, v){
      if (k != "Id" && k != "Logo"){
        var compare = ""
        if (k=="Founded" || k=="Ranking" || k=="Percent" || k=="Growth" || k=="Revenue" || k=="NetIncome"){
          compare = v.toString().toLowerCase()
        }
        else if (k == "Industry"){
          compare = v.join(', ').toLowerCase()
        }
        else{
          compare = v.toLowerCase()
        }
        if (compare.indexOf(input) != -1){
          relevant.push(obj)
          return false;
        }
      }
    })
    display(relevant)
  });
}

// display link if successful
var display = function(brands){
  $.each(brands, function(i, obj){
    var result = $("<div class='record'>")
    var link = $($($("<a>")).append(obj.Name)).attr("href", "/item/" + obj.Id)
    var name = $("<div>").append(link).addClass("nameStyleS")
    var shortDesc = obj.Description.substring(0,250) + " ..."
    var desc = $($($("<div>")).append(shortDesc))
    var joinIndustry =  obj.Industry.join(', ')
    var industry = $($($("<div>")).append(joinIndustry)).addClass("indusStyleS")
    if (obj.Percent > 0){
      var percent = $("<span class='mr-3'>").append("+" + obj.Percent + "%").addClass("boldish")
    } else {
      var percent = $("<span class='mr-3'>").append(obj.Percent + "%").addClass("boldish")
    }
    var growth = $("<span>").append("$" + obj.Growth.toLocaleString() + " million").addClass("boldish")
    var url = $($($("<div>")).append(obj.URL)).addClass("urlStyleS")
    $(result).append(name)
    $(result).append(url)
    $(result).append(desc)
    $(result).append(industry)
    $(result).append(percent)
    $(result).append(growth)
    $("#results").append(result).append("<br>")
  });
}

// Wait for html to be ready
$(document).ready(function(){
  // Focus on brands input
  $("#lookup").focus();

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
