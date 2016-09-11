"use strict"

window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

function repeatNTimes(n, callback) {
  for (let i=0; i<n; i++) callback(i);
}

HTMLElement.prototype.appendNChildren = function(numElems, className, reverseNumbering=false, callback) {
  repeatNTimes(numElems, (n) => {
    let div = document.createElement("div");
    div.className = `${className} ${className}-${ reverseNumbering ? numElems - 1 - n : n}`;
    this.appendChild(div);
    if (callback) callback(div, n);
  });
}

// Given a callback, and x, y coordinates, only execute the callback if the coordinates have changed
// by more than minPointerDifference
var lastPointers = {};
function executeOnGreatEnoughChange(x, y, minPointerDifference, name, callback) {
  var lastPointer = lastPointers[name];

  if (!lastPointer) {
    lastPointers[name] = [x, y];
    return callback();
  }

  var diff = Math.abs(x - lastPointer[0]) + Math.abs(y - lastPointer[1]);
  if (diff > minPointerDifference) {
    lastPointers[name] = [x, y];
    return callback();
  }
}

// return the angle, between 0-90
function calculateAngle(xDist, yDist) {
  const rad2deg = 180/Math.PI;
  var x = Math.abs(xDist);
  var y = Math.abs(yDist);
  var degrees = Math.atan( y / x) * rad2deg;
  return degrees % 90;
}

window.addEventListener('load', function() {
  var legoSpace = new LegoSpace();
  var xPlane = new XPlane(legoSpace);
  var yPlane = new YPlane(legoSpace);
  var zPlane = new ZPlane(legoSpace);
  initEventHandlers();
});