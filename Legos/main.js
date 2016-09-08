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

window.addEventListener('load', function() {
  var legoSpace = new LegoSpace();
  var xPlane = new XPlane(legoSpace);
  var yPlane = new YPlane(legoSpace);
  var zPlane = new ZPlane(legoSpace);
  initEventHandlers();
});