window.addEventListener('load', function() {
  var legoSpace = new LegoSpace();
  var xPlane = new XPlane(legoSpace);
  var yPlane = new YPlane(legoSpace);
  var zPlane = new ZPlane(legoSpace);
  initEventHandlers();
});