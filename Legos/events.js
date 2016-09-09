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
    var toTransform = "";
    var currTransform = $("#lego-space").style.transform;
    var magicNumber = .001; //amount to increase scale by
    var baseScale = 1;

    if (currTransform.match(/scale3d/)) {
      var r = new RegExp(/\s?scale3d\(([\d\.]+),\s?[\d\.]+,\s?[\d\.]+\)/g).exec(currTransform);
      if (r) {
        currTransform = currTransform.replace(r[0], "");
        baseScale = parseFloat(r[1]);
      }
    }

    var newScale = (magicNumber * event.wheelDelta) + baseScale;
    toTransform = currTransform + ` scale3d(${newScale}, ${newScale}, ${newScale})`;
    // console.log(toTransform);
    $("#lego-space").style.transform = toTransform;

    event.preventDefault();
  }
}

function addMouseOver() {
  // addHandlers(".cell", "mouseover", onMouseOver);
}

function onMouseOver(event) {
  var targetCell = event.target;
  var targetPlane = targetCell.parentElement.parentElement;
  console.log("At mouseover: Plane: " + targetPlane.className + " Cell: " + targetCell.className);
  targetCell.style.backgroundColor = "yellow";
}

//---------- Assign Event Handlers ------------
function initEventHandlers() {
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);
  window.addEventListener("mousemove", dragLegoSpace);
  window.addEventListener("wheel", wheelMove);
  addMouseOver();
  initializeDrag();
}