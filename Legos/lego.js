class Lego {
  constructor(sourceLegoPile, startClientX, startClientY) {
    this.lastClientX = startClientX;
    this.lastClientY = startClientY;

    this.zPlaneCell = 0;
    this.zPlaneRow = 0;

    var legoTemplate = $("#lego-template")
    this.elem = document.importNode(legoTemplate.content, true).children[0];
    $(".plane-x").appendChild(this.elem);

    //set the color
    var color = sourceLegoPile.className.split(" ")[1]
    this.elem.className += " " + color;
  }

  // Try to figure out which axis the user is moving the lego along
  // this is done by getting the angle of movement of the mouse,
  // the angles of the 3 axes, and returning the axis with the angle
  // closest to the mouse movement
  // returns the closest two axes
  getAxisOfMovement(eventX, eventY) {

    let mouseAngle = calculateAngle(eventX - this.lastClientX, eventY - this.lastClientY);
    console.log(`mouse angle: ${mouseAngle} eventY: ${eventY} lastY: ${this.lastClientY} eventX: ${eventX} lastX: ${this.lastClientX}`);
    // let closestAngle = null;
    // let closestAxis = null;
    let closest = [];

    //get the axis angles
    $$(".axis").forEach( axis => {
      let rect = axis.getBoundingClientRect()
      let angle = calculateAngle(rect.right - rect.left, rect.bottom - rect.top);
      let axisName = axis.className.match(/axis-([xyz])/i)[1];
      console.log(`axis: ${axisName} angle: ${angle} top: ${rect.top} bottom: ${rect.bottom} left: ${rect.left} right: ${rect.right}`);

      // if (closestAngle == null || Math.abs(mouseAngle - angle) < Math.abs(mouseAngle - closestAngle)) {
      //   closestAngle = angle;
      // let closestAxis = axis.className.match(/axis-([xyz])/i)[1];
      // }

      closest.push([axisName, angle, Math.abs(mouseAngle - angle)]);
    });

    closest.sort( (a, b) => {
      return a[2] - b[2];
    });

    console.log(closest);
    return [closest[0][0], closest[1][0]];

    // console.log(`closestAngle: ${closestAxis}: ${closestAngle}`);
    // return closestAxis;
  }


  drag(eventX, eventY) {
    var xPlaneRect = $(".plane-x").getBoundingClientRect();
    // console.log(`drag x:${eventX} y:${eventY} lego x:${this.elem.style.left} y:${this.elem.style.top}`);

    // can only move one dimension at a time!
    var axis = this.getAxisOfMovement(eventX, eventY);
    console.log(`axes to update: ${axis}`);

    // Y
    // if (axis == 'z') {
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
    // if (axis == 'x') {
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

    // Z
    // if (axis == 'y') {
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

    //update last xy
    this.lastClientX = eventX;
    this.lastClientY = eventY;
    console.log(`coords: ${this.zPlaneCell}, ${this.zPlaneRow}`);

    $$('.plane-x .cell.active').forEach( cell => {cell.className = cell.className.replace("active", "");});
    $(`.plane-x .row-${this.zPlaneRow} .cell-${this.zPlaneCell}`).className += " active";
  }

}