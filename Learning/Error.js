/*------- Exception Handling in JS ----------*/


/* The standard error handling method */
function test1() {
  try {
    throw "hello world";
    console.log("below exception"); //never reached
  } catch (ex) {
    // ex is scoped to the catch block (unlike other vars in js, which don't block scope)
    console.log("caught exception: " + ex);
  } finally {
    console.log("at finally");
  }
}
test1();


/* Error handling with defined Error objects (fully supported) */
function test2() {
  try {
    throw new Error('Whoops!');
  } catch (ex) {
    console.log('caught error: ' + ex.name + ': ' + ex.message);
  }
}
test2();

/* Error handling with std js Error object, and custom Error object (fully supported) */
function MyError(message, weather) {
  this.message = message;
  this.weather = weather;
  this.toString = function() {
    return `Oh no, the following error has been encountered: ${this.message}. Also, the weather is ${this.weather}`;
  }
}

function test3() {
  try {
    //custom error
    throw new MyError("a new error", "sunny");
    //JS standard error
    // throw new Error("an old error");
  } catch (ex) {
    if (ex instanceof MyError) {
      //different error handlers for different error types
      console.log("MyError: " + ex);
    } else {
      console.log("JSError: " + ex);
    }
  }
}
test3();