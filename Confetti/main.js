//+color
//+fall
//+rotate
//randomize the fall rate, size?

$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);

var confetti = (function() {

  this.hex = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];

  //returns a random number between low and high, inclusive
  this.randomRange = function(low, high) {
    return Math.floor( (Math.random() * (high + 1 - low)) + low );
  }

  //returns a random color in hex format
  this.randomColor = function() {
    var color = "#";
    for (let i=0; i<6; i++) color += hex[ randomRange(0, 15) ];
    return color;
  }

  this.getViewport = function() {
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
      this.generateStar();
      window.setTimeout("confetti.beginCreatingStars()", randomRange(0, 1000));
    }
  };
})();

window.addEventListener('load', function() {
  confetti.setup();
  confetti.beginCreatingStars();
});