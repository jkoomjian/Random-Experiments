//= require jquery
//= require jquery_ujs
//= require slides.min.jquery.js

  $(function () {
    $("#slides").slides({ 
      play:5000,
      pause:2500,
      hoverPause:true
    });
  });