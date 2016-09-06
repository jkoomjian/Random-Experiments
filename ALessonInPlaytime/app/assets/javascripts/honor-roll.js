$(document).ready(function(){
  $("#honor-roll .thumb-photos").on("click", function() {
    var imgsrc = $(this).find("img").attr("src");
    imgsrc = imgsrc.replace("thumb", "full");
    $("img.orig").first().attr("src", imgsrc);
    return false;
  });
});