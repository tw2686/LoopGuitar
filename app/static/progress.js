// Tsun Ting (James) Wong - tw2686
// COMS 4170: User Interface Design
// Homework 12

function updateChart(){
  var videoNames = []
  var videoTimes = []
  $.each(videos, function(i, video){
    $.each(video, function(k, v){
      if (k == "Name"){
        videoNames.push(v)
      }
      else if (k == "TimeSpent") {
        videoTimes.push(v)
      }
    })
  })
  Highcharts.chart('chart', {
    chart: {
      type: 'bar'
    },
    title: {
      text: null
    },
    subtitle: {
      text: null
    },
    xAxis: {
      categories: videoNames,
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Time(min)',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    tooltip: {
      valueSuffix: 'minutes'
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Time',
      data: videoTimes
    }]
  });
}

// Wait for html to be ready
$(document).ready(function(){
  updateChart();
})
