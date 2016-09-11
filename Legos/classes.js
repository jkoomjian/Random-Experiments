class LegoSpace {
  constructor() {
    this.elem = $("#lego-space");
    var w = this.elem.offsetWidth;
    var y = this.elem.offsetHeight;

    // set font-size
    // this.elem.style.fontSize = ((w / 10) * .66) + "px";

    //set origin (0,0)
    //this.origin = {x: Math.floor( w * .4),
    //              y: Math.floor( y * .66)};
  }
}


class Plane {
  constructor(legoSpace, planeDimension) {

    // Create the dom nodes for the plane
    this.planeDimension = planeDimension;
    this.elem = document.createElement("div");
    this.elem.className = `plane plane-${this.planeDimension}`;
    $("#lego-space").appendChild(this.elem);

    //add axis line
    this.axis = document.createElement("hr");
    this.axis.className = "axis axis-" + planeDimension;
    this.elem.appendChild(this.axis);

    //add cols, rows
    this.elem.appendNChildren(10, "row", true, (parent) => {
      parent.appendNChildren(10, "cell");
    });

    //position at origin
    // this.elem.style.top = legoSpace.origin.y + "px";
    // this.elem.style.left = legoSpace.origin.x + "px";

    this.rotateAboutOrigin();
  }

  //subclass
  rotateAboutOrigin() {}
}

class YPlane extends Plane {
  constructor(legoSpace) {
    super(legoSpace, "y");
  }
  rotateAboutOrigin() {
    this.axis.style.transform = "rotate(-90deg)";
  }
}

class XPlane extends Plane {
  constructor(legoSpace) {
    super(legoSpace, "x");
  }
  rotateAboutOrigin() {
    this.elem.style.transform = "rotateX(-90deg)";
  }
}

class ZPlane extends Plane {
  constructor(legoSpace) {
    super(legoSpace, "z");
  }
  rotateAboutOrigin() {
    this.elem.style.transform = "rotateY(-90deg)";
  }
}

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
  // the angles of the 3 axis, and returning the axis with the angle
  // closest to the mouse movement
  getAxisOfMovement(eventX, eventY) {

    let mouseAngle = calculateAngle(eventX - this.lastClientX, eventY - this.lastClientY);
    console.log(`mouse angle: ${mouseAngle} eventY: ${eventY} lastY: ${this.lastClientY} eventX: ${eventX} lastX: ${this.lastClientX}`);
    let closestAngle = null;
    let closestAxis = null;

    //get the axis angles
    $$(".axis").forEach( axis => {
      let rect = axis.getBoundingClientRect()
      let angle = calculateAngle(rect.right - rect.left, rect.bottom - rect.top);
      console.log(`axis: ${axis.className} angle: ${angle} top: ${rect.top} bottom: ${rect.bottom} left: ${rect.left} right: ${rect.right}`);

      if (closestAngle == null || Math.abs(mouseAngle - angle) < Math.abs(mouseAngle - closestAngle)) {
        closestAngle = angle;
        closestAxis = axis.className.match(/axis-([xyz])/i)[1];
      }
    });

    console.log(`closestAngle: ${closestAxis}: ${closestAngle}`);
    return closestAxis;
  }


  drag(eventX, eventY) {
    var xPlaneRect = $(".plane-x").getBoundingClientRect();
    // console.log(`drag x:${eventX} y:${eventY} lego x:${this.elem.style.left} y:${this.elem.style.top}`);

    // can only move one dimension at a time!
    var axis = this.getAxisOfMovement(eventX, eventY);

    // Y
    if (axis == 'z') {
      var legoYxy; // y dimension in the xy plane (not the x plane the block rests on)
      if (eventY < xPlaneRect.top) {
        legoYxy = "9";
      } else if (eventY > xPlaneRect.bottom){
        legoYxy = "0";
      } else {
        legoYxy = (eventY - xPlaneRect.top) / (xPlaneRect.bottom - xPlaneRect.top);
        legoYxy = Math.floor(9 - (legoYxy * 10));
      }
      this.elem.style.top = legoYxy + "rem";
      this.zPlaneRow = 9 - legoYxy;
    }

    // X
    if (axis == 'x') {
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
    if (axis == 'y') {
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