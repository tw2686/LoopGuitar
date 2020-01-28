// Tsun Ting (James) Wong - tw2686
// COMS 4170: User Interface Design
// Homework 8

// Check for valid inputs
var check_input = function(){
  var name = $("#name").val();
  var logo = $("#logo").val();
  var description = $("#description").val();
  var founded = $("#founded").val();
  var industry = $("#industry").val().split(',');
  var headquarters = $("#headquarters").val();
  var revenue = $("#revenue").val();
  var netincome = $("#netincome").val();
  var ranking = $("#ranking").val();
  var percent = $("#percent").val();
  var growth = $("#growth").val();
  var url = $('#url').val();

  if (name.length <= 0) {
    alert("Name Field was Empty.");
    $("#name").focus();
  }
  else if (logo.length <= 0) {
    alert("Logo Field was Empty.");
    $("#logo").focus();
  }
  else if (description.length <= 0) {
    alert("Description Field was Empty.");
    $("#description").focus();
  }
  else if (founded.length <= 0) {
    alert("Founded Field was Empty.");
    $("#founded").focus();
  }
  else if (industry.length <= 0) {
    alert("Industry Field was Empty.");
    $("#industry").focus();
  }
  else if (headquarters.length <= 0) {
    alert("Headquarters Field was Empty.");
    $("#headquarters").focus();
  }
  else if (revenue.length <= 0) {
    alert("Revenue Field was Empty.");
    $("#revenue").focus();
  }
  else if (netincome.length <= 0) {
    alert("Net Income Field was Empty.");
    $("#netincome").focus();
  }
  else if (ranking.length <= 0) {
    alert("Ranking Field was Empty.");
    $("#ranking").focus();
  }
  else if (percent.length <= 0) {
    alert("Growth Percent Field was Empty.");
    $("#percent").focus();
  }
  else if (growth.length <= 0) {
    alert("Growth Field was Empty.");
    $("#growth").focus();
  }
  else if (url.length <= 0) {
    alert("URL Field was Empty.");
    $("#url").focus();
  }
  else if ($.isNumeric(founded)==false) {
    alert("The Year Founded is Not a Number.");
    $("#founded").focus();
  }
  else if ($.isNumeric(revenue)==false) {
    alert("The Revenue is Not a Number.");
    $("#revenue").focus();
  }
  else if ($.isNumeric(netincome)==false) {
    alert("The Net income is Not a Number.");
    $("#ranking").focus();
  }
  else if ($.isNumeric(ranking)==false) {
    alert("The Ranking is Not a Number.");
    $("#ranking").focus();
  }
  else if ($.isNumeric(percent)==false) {
    alert("The Growth Percent is Not a Number.");
    $("#percent").focus();
  }
  else if ($.isNumeric(growth)==false) {
    alert("The Growth is Not a Number.");
    $("#growth").focus();
  }
  else {
    var new_brand = {
      "Name": name,
      "Logo": logo,
      "Description": description,
      "Founded": parseInt(founded),
      "Industry": industry,
      "Headquarters": headquarters,
      "Revenue": parseInt(revenue),
      "NetIncome": parseInt(netincome),
      "Ranking": parseInt(ranking),
      "Percent": parseInt(percent),
      "Growth": parseInt(growth),
      "URL": url
    };
    save_item(new_brand);
  }
}

// Create brands record
var save_item = function(new_item){
  var data_to_save = new_item
  $.ajax({
    type: "POST",
    url: "save_item",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(data_to_save),
    success: function(result){
      var brands = result["brands"]
      display_link(brands)
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
var display_link = function(brands){
  $("#record_link").val("");
  var link = $("<a>Link to recently added item</a>")
  var id = brands.length
  $(link).attr("href", "/item/" + id)
  $("#record_link").append(link)

  $("#name").val("");
  $("#logo").val("");
  $("#description").val("");
  $("#founded").val("");
  $("#industry").val("");
  $("#headquarters").val("");
  $("#revenue").val("");
  $("#netincome").val("");
  $("#ranking").val("");
  $("#percent").val("");
  $("#growth").val("");
  $("#url").val("");

  $("#name").focus();
}

// display error if unsuccessful
var display_error = function(){
  $("#record_link").val("");
  var error = $("<a class='alert alert-danger'>Failed to add item to database.</a>")
  $("#record_link").append(error)
}

// Autocomplete clients
var update_names = function(brands){
  var brandNames = []
  $.each(brands, function(i, item){
    brandNames.push(item["Name"])
  });
  $( ".autobrands" ).autocomplete({
    source: brandNames
  });
}

// Wait for html to be ready
$(document).ready(function(){
  // Focus on brands input
  $("#name").focus();

  // Autocomplete brands
  update_names(brands);

  // Allow submission via enter
  $("#growth").keypress(function(e) {
    if (e.which == 13) {
      event.preventDefault();
      check_input();
    }
  });

  // Create click events for submit button
  $("#submit").on('click', check_input);

})
