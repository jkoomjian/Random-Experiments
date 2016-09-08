class LegoSpace {
  constructor() {
    this.elem = $("#lego-space");
    var w = this.elem.offsetWidth;
    var y = this.elem.offsetHeight;

    // set font-size
    this.elem.style.fontSize = ((w / 10) * .66) + "px";

    //set origin
    this.origin = {x: Math.floor( w * .2), y: Math.floor( y * .8)};
  }
}


class Plane {
  constructor(legoSpace, planeDimension) {

    // Create the dom nodes for the plane
    this.planeDimension = planeDimension;
    this.elem = document.createElement("div");
    this.elem.className = `plane plane-${this.planeDimension}`;
    $("#lego-space").appendChild(this.elem);

    //add cols, rows
    this.elem.appendNChildren(10, "row", (parent) => {
      parent.appendNChildren(10, "cell");
    });

    //position at origin
    this.elem.style.top = (legoSpace.origin.y - this.elem.offsetHeight) + "px";
    this.elem.style.left = legoSpace.origin.x + "px";

    this.elem.style.transformOrigin = "bottom left";
    this.rotateAboutOrigin();
  }

  //subclass
  rotateAboutOrigin() {}
}

class YPlane extends Plane {
  constructor(legoSpace) {
    super(legoSpace, "y");
  }
}

class XPlane extends Plane {
  constructor(legoSpace) {
    super(legoSpace, "x");
  }
  rotateAboutOrigin() {
    console.log("at xplane rotate");
    this.elem.style.transform = "rotateX(-90deg)";
  }
}

class ZPlane extends Plane {
  constructor(legoSpace) {
    super(legoSpace, "z");
  }
  rotateAboutOrigin() {
    console.log("at zplane rotate");
    this.elem.style.transform = "rotateY(-90deg)";
  }
}