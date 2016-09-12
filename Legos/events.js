var ctrlKeyDown = false;
var shiftKeyDown = false;
var mouseBtnDown = false;
var mouseMiddleBtnDown = false;
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

  } else if (mouseMiddleBtnDown) {
    setPrefixedCursorStyle("grabbing");
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

function zoom(zoomAmt){
  var t = new Transform($("#lego-space").style.transform)
  var magicNumber = .001; //amount to increase scale by
  var baseScale = 1;

  if (t.transform["scale3d"]){
    baseScale = t.transform["scale3d"];
    baseScale = baseScale.split(",")[0].trim();
    baseScale = parseFloat(baseScale);
  }

  var newScale = (magicNumber * zoomAmt) + baseScale;
  t.transform["scale3d"] = `${newScale}, ${newScale}, ${newScale}`;
  $("#lego-space").style.transform = t.toString();
}

//---------- Key events ------------
function keyDown(event) {
  // console.log("keyCode: " + event.keyCode);
  switch(event.keyCode) {
    case 17:
      ctrlKeyDown = true
      break;
    case 16:
      shiftKeyDown = true;
      break;
    case 187: //+
      zoom(120);
      break;
    case 189: //-
      zoom(-120);
      break;
  }

  updatePointerState();
}

function keyUp(event) {
  if (event.keyCode === 17) ctrlKeyDown = false;
  if (event.keyCode == 16) shiftKeyDown = false;
  updatePointerState();
}

function mouseDown(event) {
  if (event.button === 0) mouseBtnDown = true;
  if (event.button === 1) mouseMiddleBtnDown = true;
  if (ctrlKeyDown || shiftKeyDown || mouseMiddleBtnDown) {
    lastMouseCoords = [event.clientX, event.clientY];
    event.preventDefault();
    updatePointerState();
  }
}

function mouseUp(event) {
  mouseBtnDown = false;
  mouseMiddleBtnDown = false;
  if (ctrlKeyDown || shiftKeyDown || event.button === 1) {
    updatePointerState();
    event.preventDefault();
  }
}

function mouseMove(event) {
  var action;
  // orbit
  if ((ctrlKeyDown && mouseBtnDown) || mouseMiddleBtnDown) action = orbitLegoSpace;
  // pan
  if (shiftKeyDown && mouseBtnDown) action = panLegoSpace;

  if (action) {
    var currMouseCoords = [event.clientX, event.clientY];
    executeOnGreatEnoughChange(event.clientX, event.clientY, 10, 'mouseMove', function() {
      action(lastMouseCoords, currMouseCoords);
      lastMouseCoords = currMouseCoords;
    });
    event.preventDefault();
  }
}

function wheelMove(event) {
  zoom(event.wheelDelta);
  event.preventDefault();
}

//---------- Assign Event Handlers ------------
function initEventHandlers() {
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);
  window.addEventListener("mousemove", mouseMove);
  $("#lego-space").addEventListener("wheel", wheelMove);
  initializeDrag();
}