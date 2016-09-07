"use strict"

window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

function repeatNTimes(n, callback) {
  for (let i=0; i<n; i++) callback(i);
}

HTMLElement.prototype.appendNChildren = function(numElems, className, callback) {
  repeatNTimes(numElems, (n) => {
    let div = document.createElement("div");
    div.className = `${className} ${className}-${n}`;
    this.appendChild(div);
    if (callback) callback(div, n);
  });
}

class Plane {
  constructor(planeDimension, legoSpace) {

    // Create the dom nodes for the plane
    this.elem = document.createElement("div");
    this.elem.className = `plane plane-${planeDimension}`;
    $("#lego-space").appendChild(this.elem);

    //add cols, rows
    this.elem.appendNChildren(10, "row", (parent) => {
      parent.appendNChildren(10, "cell");
    });

    //set origin
    this.elem.style.top = (legoSpace.origin.y - this.elem.offsetHeight) + "px";
    this.elem.style.left = legoSpace.origin.x + "px";

  }
}

class LegoSpace {
  constructor() {
    this.elem = $("#lego-space");
    var w = this.elem.offsetWidth;
    var y = this.elem.offsetHeight;

    // set font-size
    this.elem.style.fontSize = ((w / 10) * .66) + "px";

    //set origin
    this.origin = {x: Math.floor( w * .2), y: Math.floor( y * .8)};
  }
}


window.addEventListener('load', function() {
  var legoSpace = new LegoSpace();
  var yPlane = new Plane('y', legoSpace);
});