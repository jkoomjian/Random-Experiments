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

    // Y
    var legoYxy; // y dimension in the xy plane (not the x plane the block rests on)
    if (eventY < xPlaneRect.top) {
      legoYxy = "9";
    } else if (eventY > xPlaneRect.bottom){
      legoYxy = "0";
    } else {
      legoYxy = (eventY - xPlaneRect.top) / (xPlaneRect.bottom - xPlaneRect.top);
      legoYxy = Math.floor(10 - (legoYxy * 10));
    }

    //X
    var legoXxy;
    if (eventX < xPlaneRect.left) {
      legoXxy = "0";
    } else if (eventX > xPlaneRect.right){
      legoXxy = "9";
    } else {
      legoXxy = (eventX - xPlaneRect.left) / (xPlaneRect.right - xPlaneRect.left);
      legoXxy = Math.floor(legoXxy * 10);
    }
    console.log(`plane x coords: ${legoXxy}, ${legoYxy}`);

    this.elem.style.left = legoXxy + "rem";
    this.elem.style.top = legoYxy + "rem";
  }

}