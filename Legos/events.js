var ctrlKeyDown = false;
var shiftKeyDown = false;
var mouseBtnDown = false;
var lastMouseCoords = [];


//---------- Pointer State ------------
function setPrefixedCursorStyle(style) {
  document.body.style.cursor = `-webkit-${style}`;
  document.body.style.cursor = `-moz-${style}`;
}

function updatePointerState() {

  if (ctrlKeyDown || shiftKeyDown) {

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
function orbitLegoSpace(startCoords, endCoords) {
  var t = new Transform( $("#lego-space").style.transform );
  var magicNumber = .2;  //how much should the axis rotate for a given distance mouse movement
  var existingDegX = t.getPropValueInDegree("rotateX");
  var existingDegY = t.getPropValueInDegree("rotateY");
  var xDeg = Math.round((endCoords[0] - startCoords[0]) * magicNumber) + existingDegY;
  var yDeg = Math.round((endCoords[1] - startCoords[1]) * -1 * magicNumber) + existingDegX;
  t.transform["rotateX"] = yDeg + "deg";
  t.transform["rotateY"] = xDeg + "deg";
  $("#lego-space").style.transform = t.toString();
}

function panLegoSpace(startCoords, endCoords) {
  var t = new Transform( $("#lego-space").style.transform );
  var magicNumber = 1;
  var translateY = parseInt(t.transform.translateY || 0, 10);
  var translateX = parseInt(t.transform.translateX || 0, 10);
  var xDist = Math.round((endCoords[0] - startCoords[0]) * magicNumber) + translateX;
  var yDist = Math.round((endCoords[1] - startCoords[1]) * magicNumber) + translateY;
  t.transform["translateX"] = xDist + "px";
  t.transform["translateY"] = yDist + "px";
  $("#lego-space").style.transform = t.toString();
}

//---------- Key events ------------
function keyDown(event) {
  if (event.keyCode === 17) ctrlKeyDown = true;
  if (event.keyCode == 16) shiftKeyDown = true;
  updatePointerState();
}

function keyUp(event) {
  if (event.keyCode === 17) ctrlKeyDown = false;
  if (event.keyCode == 16) shiftKeyDown = false;
  updatePointerState();
}

function mouseDown(event) {
  mouseBtnDown = true;
  if (ctrlKeyDown || shiftKeyDown) {
    lastMouseCoords = [event.clientX, event.clientY];
    event.preventDefault();
    updatePointerState();
  }
}

function mouseUp(event) {
  mouseBtnDown = false;
  if (ctrlKeyDown || shiftKeyDown) {
    updatePointerState();
    event.preventDefault();
  }
}

function dragLegoSpace(event) {
  if ((ctrlKeyDown || shiftKeyDown) && mouseBtnDown) {
    var currMouseCoords = [event.clientX, event.clientY];
    executeOnGreatEnoughChange(event.clientX, event.clientY, 10, 'dragLegoSpace', function() {
      let action = ctrlKeyDown ? orbitLegoSpace : panLegoSpace;
      action(lastMouseCoords, currMouseCoords);
      lastMouseCoords = currMouseCoords;
    });
    // if (pointerPositionDifference(currMouseCoords, lastMouseCoords) > 5) {
    // }
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

//---------- Assign Event Handlers ------------
function initEventHandlers() {
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);
  window.addEventListener("mousemove", dragLegoSpace);
  window.addEventListener("wheel", wheelMove);
  initializeDrag();
}