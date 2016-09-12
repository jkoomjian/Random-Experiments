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
