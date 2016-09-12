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

    // can only move two dimensions at a time!
    var axis = this.mousePath.onDragGetAxes(eventX, eventY);
    console.log(`axes to update: ${axis}`);

    // Z
    if (axis.includes('z')) {
      var legoYxy; // y dimension in the xy plane (not the x plane the block rests on)
      if (eventY < xPlaneRect.top) {
        legoYxy = "9";
      } else if (eventY > xPlaneRect.bottom){
        legoYxy = "0";
      } else {
        legoYxy = (eventY - xPlaneRect.top) / (xPlaneRect.bottom - xPlaneRect.top);
        legoYxy = 9 - Math.floor(legoYxy * 10);
      }
      this.elem.style.top = legoYxy + "rem";
      this.zPlaneRow = 9 - legoYxy;
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
      this.elem.style.left = legoXxy + "rem";
      this.zPlaneCell = legoXxy;
    }

    // Y
    if (axis.includes('y')) {
      // debugger;
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
      this.elem.style.transform = `translateZ(-${legoZxy}rem)`;
    }

    console.log(`coords: ${this.zPlaneCell}, ${this.zPlaneRow}`);

    $$('.plane-x .cell.active').forEach( cell => {cell.className = cell.className.replace("active", "");});
    $(`.plane-x .row-${this.zPlaneRow} .cell-${this.zPlaneCell}`).className += " active";
  }

}