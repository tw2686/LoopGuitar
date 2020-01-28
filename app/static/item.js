// Tsun Ting (James) Wong - tw2686
// COMS 4170: User Interface Design
// Homework 8

// next
var next = function(){
  var currPath = window.location.pathname
  var id = parseInt(currPath.substring(6)) + 1
  if (id > brands.length){
    id = 1
  }
  document.location.href = "/item/" + id;
}

// next
var prev = function(){
  var currPath = window.location.pathname
  var id = parseInt(currPath.substring(6)) - 1
  if (id <= 0){
    id = brands.length
  }
  document.location.href = "/item/" + id;
}

// Catch invalid image
function imgError(image) {
  image.onerror = "";
  var error = $("<div><a class='alert alert-danger'>Failed to load image.</a></div>")
  $("#img").append(error)
  return true;
}
// display item
var display_item = function(obj){

  var name = $("<span>").append(obj.Name)
  var hq = $("<span>").append(obj.Headquarters)
  var img = $("<img class='h-25' onerror='imgError(this)'>").attr({"src": obj.Logo, "alt": "Logo"})
  var logo = $("<div>").append(obj.Logo).addClass("small")
  var desc = $("<div>").append(obj.Description)
  var found = $("<span>").append(obj.Founded)
  var joinIndustry =  obj.Industry.join(', ')
  var industry = $("<span>").append(joinIndustry)
  var revenue = $("<div>").append("$"+obj.Revenue+" billion")
  var netincome = $("<div>").append("$"+obj.NetIncome+" billion")
  var ranking = $("<span>").append(obj.Ranking)
  if (obj.Percent > 0){
    var percent = $("<span>").append("+" + obj.Percent + "%")
  } else {
    var percent = $("<span>").append(obj.Percent + "%")
  }
  var growth = $("<div>").append("$" + obj.Growth.toLocaleString() + " million")
  var url = $("<div>").append(obj.URL).addClass("small")

  $("#name").append(name)
  $("#headquarters").append(hq)
  $("#founded").append(found)
  $("#ranking").append(ranking)
  $("#img").append(img)
  $("#logo").append(logo)
  $("#percent").append(percent)
  $("#growth").append(growth)
  $("#revenue").append(revenue)
  $("#netincome").append(netincome)
  $("#description").append(desc)
  $("#industry").append(industry)
  $("#url").append(url)
}

// Wait for html to be ready
$(document).ready(function(){
  display_item(brand)
  $("#prev").on('click', prev);
  $("#next").on('click', next);
})
