/* Things you can do with objects */


//Static variables
UniqueCounter.currCount = 0;
function UniqueCounter() {
  this.incCount = function () {
    UniqueCounter.currCount++;
    console.log("curr count is: " + UniqueCounter.currCount);
  }
}

var u1 = new UniqueCounter();
var u2 = new UniqueCounter();
u1.incCount();  // 1
u2.incCount();  // 2
u1.incCount();  // 3


// Object that works as both an object and a function, like jQuery does
function $() {
  return "hello from $";
}
$.myProp = "$prop";
$.myFunc = function() {
  console.log("hello from myfunc");
}

$();          //hello from $
$.myFunc();   //hello from myfunc