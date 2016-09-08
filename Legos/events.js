var ctrlKeyDown = false;
var mouseBtnDown = false;
var lastMouseCoords = [];


//---------- Pointer State ------------
function setPrefixedCursorStyle(style) {
  document.body.style.cursor = `-webkit-${style}`;
  document.body.style.cursor = `-moz-${style}`;
}

function updatePointerState() {

  if (ctrlKeyDown) {

    if (mouseBtnDown) {
      setPrefixedCursorStyle("grabbing");
    } else {
      setPrefixedCursorStyle("grab");
    }

  } else {
    // default
    document.body.style.cursor = "default";
  }
}

// Rotate the lego space
function rotateLegoSpace(startCoords, endCoords) {

  function getExistingRotateDegrees() {
    var existingRotationalDegrees = {x: 0, y: 0};
    var existingTransform = $("#lego-space").style.transform;
    ['X', 'Y'].forEach( axis => {
      var r = new RegExp("rotate"+axis+"\\((-?\\d+)deg\\)", 'g').exec(existingTransform);
      if (r && r.length > 1) existingRotationalDegrees[axis.toLowerCase()] = parseInt(r[1], 10);
    });
    return existingRotationalDegrees;
  }

  var magicNumber = .2;  //how much should the axis rotate for a given distance mouse movement
  var existingDegs = getExistingRotateDegrees();
  var xDeg = Math.round((endCoords[0] - startCoords[0]) * magicNumber) + existingDegs.y;
  var yDeg = Math.round((endCoords[1] - startCoords[1]) * -1 * magicNumber) + existingDegs.x;
  // console.log(`x: ${endCoords[0] - startCoords[0]}, y: ${endCoords[1] - startCoords[1]} end coords: ${endCoords} startCoords: ${startCoords}`);
  // console.log(`rotateX(${yDeg}deg) rotateY(${xDeg}deg)`);
  $("#lego-space").style.transform = `rotateX(${yDeg}deg) rotateY(${xDeg}deg)`;
}

function pointerPositionDifference(startCoords, endCoords) {
  return Math.abs(endCoords[0] - startCoords[0]) + Math.abs(endCoords[1] - startCoords[1]);
}

//---------- Key events ------------
function keyDown(event) {
  if (event.keyCode === 17) ctrlKeyDown = true;
  updatePointerState();
}

function keyUp(event) {
  if (event.keyCode === 17) ctrlKeyDown = false;
  updatePointerState();
}

function mouseDown(event) {
  mouseBtnDown = true;
  if (ctrlKeyDown) {
    lastMouseCoords = [event.clientX, event.clientY];
  }
  updatePointerState();
  event.preventDefault();
}

function mouseUp(event) {
  mouseBtnDown = false;
  updatePointerState();
  event.preventDefault();
}

function dragLegoSpace(event) {
  if (ctrlKeyDown && mouseBtnDown) {
    var currMouseCoords = [event.clientX, event.clientY];
    if (pointerPositionDifference(currMouseCoords, lastMouseCoords) > 5) {
      rotateLegoSpace(lastMouseCoords, currMouseCoords);
      lastMouseCoords = currMouseCoords;
    }
    event.preventDefault();
  }
}

function wheelMove(event) {
  if (ctrlKeyDown) {
    var pers = window.getComputedStyle($("#lego-space")).perspective;
    pers = parseInt(pers.split("px")[0], 10);
    var magicNumber = 5; //% to increase perspective by
    $("#lego-space").style.perspective = (pers + (event.wheelDelta * magicNumber * -1)) + "px"
    event.preventDefault();
  }
}


//---------- Assign Event Handlers ------------
function initEventHandlers() {
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);
  window.addEventListener("mousemove", dragLegoSpace);
  window.addEventListener("wheel", wheelMove);
}