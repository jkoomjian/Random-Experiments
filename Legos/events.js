var ctrlKeyDown = false;
var mouseBtnDown = false;
var lastMouseCoords = [];


//---------- Pointer State ------------
function setPrefixedCursorStyle(style) {
  console.log("set " + style);
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


//---------- Key events ------------
function keyDown(event) {
  if (event.keyCode === 17) ctrlKeyDown = true;
  updatePointerState();
  event.preventDefault();
}

function keyUp(event) {
  if (event.keyCode === 17) ctrlKeyDown = false;
  updatePointerState();
  event.preventDefault();
}

function mouseDown(event) {
  mouseBtnDown = true;
  if (ctrlKeyDown) {
    lastMouseCoords = [event.clientX, event.clientY];
    window.addEventListener("mousemove", dragLegoSpace);
  }
  updatePointerState();
  event.preventDefault();
}

function mouseUp(event) {
  mouseBtnDown = false;
  if (ctrlKeyDown) {
    window.removeEventListener("mousemove", dragLegoSpace);
  }
  updatePointerState();
  event.preventDefault();
}

var degCount = 1;
function dragLegoSpace(event) {
  //TODO
  console.log("dragging");
  // $(".plane-x").style.transform = "rotate3d(1,1,1,"+degCount+"deg)"
  // $(".plane-y").style.transform = "rotate3d(1,1,1,"+degCount+"deg)"
  // $(".plane-z").style.transform = "rotate3d(1,1,1,"+degCount+"deg)"
  // degCount++;
  event.preventDefault();
}


//---------- Assign Event Handlers ------------
function initEventHandlers() {
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);
}