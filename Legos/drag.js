var lego;
function onDragStart(e) {
  console.log("start drag!");
  //create a new lego
  lego = new Lego(event.target, event.clientX, event.clientY)
  _onDragStartCommon(e);
}

function onDragStartExistingLego(e) {
  console.log("start drag w/existing lego!");
  lego = event.target.legoObj;
  _onDragStartCommon(e);
}

function _onDragStartCommon(e) {
  e.dataTransfer.dropEffect = "copy";
  e.dataTransfer.setDragImage($("#empty"), 0, 0);
}

function onDrag(event) {
  executeOnGreatEnoughChange(event.clientX, event.clientY, 30, 'dragLego', function(mouseChangeAmount) {
    // At mouse end mouse coords go off to the side
    if (mouseChangeAmount < 200) {
      lego.drag(event.clientX, event.clientY);
    }
  });
}

function onDragEnd(e) {
  console.log("at drag end");
  lego.place();
}

function initializeDrag() {
  addHandlers(".lego-pile", "dragstart", onDragStart);
  addHandlers(".lego-pile", "drag", onDrag);
  addHandlers(".lego-pile", "dragend", onDragEnd);
}

