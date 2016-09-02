//+color
//+fall
//+rotate
//randomize the fall rate, size?
//autoprefix

$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);

var confetti = (function() {

  var hex = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
  var starCount = 0;

  //returns a random number between low and high, inclusive
  function randomRange(low, high) {
    return Math.floor( (Math.random() * (high + 1 - low)) + low );
  }

  //returns a random color in hex format
  function randomColor() {
    var color = "#";
    for (let i=0; i<6; i++) color += hex[ randomRange(0, 15) ];
    return color;
  }

  function getViewport() {
      return {w: $("body").offsetWidth, h: $("body").offsetHeight};
  }

  return {
    setup: function() {
      $("body").style.width = getViewport().w + "px";
      $("body").style.height = getViewport().h + "px";
      $("body").style.overflow = "hidden";
    },
    generateStar: function () {
      var star = document.createElement("div");
      star.className = "star";
      // debugger; //todo
      $("body").appendChild(star);
      star.style.left = randomRange(0, getViewport().w - star.offsetWidth) + "px";
      star.style.backgroundColor = randomColor();
    },
    beginCreatingStars: function() {
      if (starCount > 50) return;
      console.log(`added ${starCount} stars!`);
      starCount++;
      this.generateStar();
      window.setTimeout(function() {
        window.requestAnimationFrame(function(){
          confetti.beginCreatingStars();
        });
      }, randomRange(0, 1000));
    }
  };
})();

window.addEventListener('load', function() {
  confetti.setup();
  confetti.beginCreatingStars();
});