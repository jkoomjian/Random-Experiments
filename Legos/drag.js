function addHandlers(selector, eventType, eventHandler) {
  $$(selector).forEach( elem => {
    elem.addEventListener(eventType, eventHandler);
    console.log("adding dnd handler");
  });
}

function onDragStart(e) {
  console.log("start drag!");
  e.dataTransfer.dropEffect = "copy";
  var targetLegoPile = event.target;

  //create a new lego
  var legoTemplate = $("#lego-template")
  var lego = document.importNode(legoTemplate.content, true).children[0];
  $("#lego-space").appendChild(lego);

  //set the color
  var color = targetLegoPile.className.split(" ")[1]
  lego.className += " " + color;

  e.dataTransfer.setDragImage(lego, Math.floor(lego.offsetWidth / 2) - 10, Math.floor(lego.offsetHeight / 2) - 10);
}

function onDrag(event) {
  console.log("at drag " + event.clientX + " " + event.clientY);
}

function onDragEnd(e) {
  console.log("at drag end");
}

function initializeDrag() {
  addHandlers(".lego-pile", "dragstart", onDragStart);
  addHandlers(".lego-pile", "drag", onDrag);
  addHandlers(".lego-pile", "dragend", onDragEnd);
}

