// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

/* Lesson Finder Logic */
function alipConstructQuery() {
  //construct the query - all selects can be used in combination
  var query_params = {}

  $("#search-input, .find-by select, .find-by input[type=hidden]").each(function(){
    if ($(this).val()) {
      query_params[$(this).attr("name")] = $(this).val();
    }
  });
  
  //construct the url
  var myurl = "/lessons/query/?" + $.param(query_params);
  spinner.spin($('.lessons-dock')[0]);
  $.ajax(myurl, {
      dataType: "html",
      success: function(data){
        spinner.stop();
        $(".lessons-dock").html(data);
      }
    }
  );
}


/*--------- Spinner -------------*/
var opts = {
  lines: 13, // The number of lines to draw
  length: 40, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
var spinner = new Spinner(opts);


/*--------- On Load -------------*/
$(document).ready(function() {
  if ($("#lessonfinder").length) {
    $("#lessonfinder .find-by select").change(alipConstructQuery);
    $(".search-button").click(alipConstructQuery);
    //run once on load
    alipConstructQuery();
  }
});