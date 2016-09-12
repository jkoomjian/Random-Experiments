var lego;
function onDragStart(e) {
  console.log("start drag!");
  e.dataTransfer.dropEffect = "copy";

  //create a new lego
  lego = new Lego(event.target, event.clientX, event.clientY)
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

