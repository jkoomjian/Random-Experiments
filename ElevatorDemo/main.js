var currFloor = 1;
var nextFloor;
var floorQueue = [];
var isMoving = false;


//Begin moving the elevator, kickof the main 1sec loop that tracks progress
function gotoFloor(floorNo) {

  //Add floor to queue, unless it is already there
  if (!_.contains(floorQueue, floorNo)) floorQueue.push(floorNo);

  //Only go to a floor if the elevator is not already moving
  if (!isMoving) {
    isMoving = true;
    _moveOneFloor();
  };

}

//Move to new floor
function _moveOneFloor() {

  //Find nearest floor in queue
  var destFloor = _.min(floorQueue, function(val, index, list) {
    return Math.abs(val - currFloor);
  });

  //Move 1 floor closer
  if (currFloor < destFloor) {
    nextFloor = currFloor + 1;
    $(".indicators .up").addClass("active");
  } else {
    nextFloor = currFloor - 1;
    $(".indicators .down").addClass("active");
  }

  //set the amount to move the dial
  var bottom = -190 * (nextFloor - 1);
  $(".floor-dial-face").css("bottom", bottom + "px")
  
  //upon reaching the next floor, do something
  setTimeout(_reachFloor, 1000);
}

//Reach floor
function _reachFloor() {

  currFloor = nextFloor;

  //Did elevator reach a destination floor?
  if (_.contains(floorQueue, currFloor)) {
    //turn off the button, remove from queue
    $(".floor-button.b" + currFloor).removeClass("active");
    floorQueue = _.without(floorQueue, currFloor);
  }

  //reset up/down lights
  $(".indicators > div").removeClass("active");
  
  //more floors to reach?
  if (floorQueue.length > 0) {
    _moveOneFloor();
  } else {
    //Done!!
    isMoving = false;
  }
}

function onElevatorButtonPush() {
  var $this = $(this);
  var floorNo = parseInt($this.attr("data-floor-no"), 10);
  //Ignore if floor requested == current floor
  if (!isMoving && floorNo == currFloor) return false;
  $this.addClass("active");
  gotoFloor(floorNo);
  return false;
}

$(document).ready(function() {
  $(document).on("click", ".buttons .floor-button", onElevatorButtonPush)
});