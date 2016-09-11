function addHandlers(selector, eventType, eventHandler) {
  $$(selector).forEach( elem => {
    elem.addEventListener(eventType, eventHandler);
  });
}

var lego;
function onDragStart(e) {
  console.log("start drag!");
  e.dataTransfer.dropEffect = "copy";

  //create a new lego
  lego = new Lego(event.target, event.clientX, event.clientY)
  e.dataTransfer.setDragImage($("#empty"), 0, 0);
}

function onDrag(event) {
  lego.drag(event.clientX, event.clientY);
}

function onDragEnd(e) {
  console.log("at drag end");
}

function initializeDrag() {
  addHandlers(".lego-pile", "dragstart", onDragStart);
  addHandlers(".lego-pile", "drag", onDrag);
  addHandlers(".lego-pile", "dragend", onDragEnd);
}

