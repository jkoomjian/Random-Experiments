// Responsible for determining the axis the mouse is moving along
class MousePath {

  constructor(startClientX, startClientY) {
    this.lastClientX = startClientX;
    this.lastClientY = startClientY;
    this.isInitialDrag = true;
  }

  // Try to figure out which axis the user is moving the lego along
  // this is done by getting the angle of movement of the mouse,
  // the angles of the 3 axes, and returning the axis with the angle
  // closest to the mouse movement
  getAxesClosestsToMovement(eventX, eventY) {

    let mouseAngle = calculateAngle(eventX - this.lastClientX, eventY - this.lastClientY);
    // console.log(`mouse angle: ${mouseAngle} eventY: ${eventY} lastY: ${this.lastClientY} eventX: ${eventX} lastX: ${this.lastClientX}`);
    let closest = [];

    //get the axis angles
    $$(".axis").forEach( axis => {
      let rect = axis.getBoundingClientRect()
      let angle = calculateAngle(rect.right - rect.left, rect.bottom - rect.top);
      let axisName = axis.className.match(/axis-([xyz])/i)[1];
      // console.log(`axis: ${axisName} angle: ${angle} top: ${rect.top} bottom: ${rect.bottom} left: ${rect.left} right: ${rect.right}`);
      closest.push([axisName, angle, Math.abs(mouseAngle - angle)]);
    });

    closest.sort( (a, b) => {
      return a[2] - b[2];
    });

    var log = `mouse angle: ${mouseAngle} -> ${Math.abs(eventX - this.lastClientX)} x ${Math.abs(eventY - this.lastClientY)}\n`;
    closest.forEach( e => {log += `${e[0]}: ${e[1]}\n`});
    console.log(log);

    return closest.map( ar => {return ar[0]})[0];
  }

  onDragGetAxes(eventX, eventY) {
    var axis = this.isInitialDrag ? ['x','z'] : this.getAxesClosestsToMovement(eventX, eventY);

    //update last xy
    this.lastClientX = eventX;
    this.lastClientY = eventY;

    this.isInitialDrag = false;

    return axis;
  }

}

class Lego {

  constructor(sourceLegoPile, startClientX, startClientY) {
    this.zPlaneCell = 0;
    this.zPlaneRow = 0;
    this.zPlaneHeight = 0;

    this.mousePath = new MousePath(startClientX, startClientY);

    var legoTemplate = $("#lego-template")
    this.elem = document.importNode(legoTemplate.content, true).children[0];
    $(".plane-x").appendChild(this.elem);

    //set the color
    var color = sourceLegoPile.className.split(" ")[1]
    this.elem.className += " " + color;
  }

  drag(eventX, eventY) {
    var xPlaneRect = $(".plane-x").getBoundingClientRect();
    // console.log(`drag x:${eventX} y:${eventY} lego x:${this.elem.style.left} y:${this.elem.style.top}`);

    var styleProp, style;

    // can only move 1 dimension at a time!
    var axis = this.mousePath.onDragGetAxes(eventX, eventY);
    console.log(`axes to update: ${axis}`);

    // Z
    if (axis.includes('z')) {
      // yHieght = the height above the floor the lego is
      // adding yHeight to eventY will give the y coord as if the lego was on the plane
      var yPlaneTop = $(`.plane-y .row-${this.zPlaneHeight}`).getBoundingClientRect().top;
      var yPlaneBottom = $(`.plane-y .row-0`).getBoundingClientRect().top;
      var yHeight =  Math.floor(yPlaneBottom - yPlaneTop);
      var legoYxy; // y dimension in the xy plane (not the x plane the block rests on)
      if (eventY + yHeight < xPlaneRect.top) {
        legoYxy = "9";
      } else if (eventY + yHeight > xPlaneRect.bottom){
        legoYxy = "0";
      } else {
        legoYxy = (eventY + yHeight - xPlaneRect.top) / (xPlaneRect.bottom - xPlaneRect.top);
        legoYxy = 9 - Math.floor(legoYxy * 10);
      }

      this.zPlaneRow = 9 - legoYxy;
      styleProp = "top";
      style = legoYxy + "rem";
    }

    // X
    if (axis.includes('x')) {
      var legoXxy;
      if (eventX < xPlaneRect.left) {
        legoXxy = "0";
      } else if (eventX > xPlaneRect.right){
        legoXxy = "9";
      } else {
        legoXxy = (eventX - xPlaneRect.left) / (xPlaneRect.right - xPlaneRect.left);
        legoXxy = Math.floor(legoXxy * 10);
      }
      this.zPlaneCell = legoXxy;
      styleProp = "left";
      style = legoXxy + "rem";
    }

    // Y
    if (axis.includes('y')) {
      var yPlaneRect = $(".plane-y").getBoundingClientRect();
      var xPlaneCell = $(`.plane-x .row-${this.zPlaneRow} .cell-${this.zPlaneCell}`);
      var xPlaneCellBottom = xPlaneCell.getBoundingClientRect().bottom;
      var yPlaneHeight = yPlaneRect.bottom - yPlaneRect.top;

      var legoZxy;
      if (eventY < xPlaneCellBottom - yPlaneHeight) {
        legoZxy = "9";
      } else if (eventY > xPlaneCellBottom){
        legoZxy = "0";
      } else {
        legoZxy = (xPlaneCellBottom - eventY) / yPlaneHeight;
        legoZxy = Math.floor(legoZxy * 10);
      }

      // console.log(`y axis: ${legoZxy} cellBottom: ${xPlaneCellBottom} eventY: ${eventY}`);
      this.zPlaneHeight = legoZxy;
      styleProp = "transform";
      style = `translateZ(${legoZxy * -1}rem)`;
    }

    console.log(`coords: ${this.zPlaneCell}, ${this.zPlaneRow}`);
    if (this.isCollision()) {
      console.log("collision!");
    } else {
      this.elem.style[styleProp] = style;
      $$('.plane-x .cell.active').forEach( cell => {cell.className = cell.className.replace("active", "");});
      $(`.plane-x .row-${this.zPlaneRow} .cell-${this.zPlaneCell}`).className += " active";
    }
  }

  place() {
    var landingCell = $(`.plane-x .row-${this.zPlaneRow} .cell-${this.zPlaneCell}`)
    var currStackSize = landingCell['currStackSize'] || 0;

    landingCell['currStackSize'] = currStackSize + 1;
    lego.elem.style.transform = `translateZ(${currStackSize * -1}rem)`;

    this.elem.legoObj = this;
    this.elem.addEventListener("dragstart", onDragStartExistingLego);
    this.elem.addEventListener("drag", onDrag);
    this.elem.addEventListener("dragend", onDragEnd);
  }

  isCollision() {
    var landingCell = $(`.plane-x .row-${this.zPlaneRow} .cell-${this.zPlaneCell}`)
    var currStackSize = landingCell['currStackSize'] || 0;
    return (currStackSize > this.zPlaneHeight);
  }

}