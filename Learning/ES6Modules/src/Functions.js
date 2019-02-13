/* The standard ES6 exports look like this */

const PI = 3.14;

function getTime() {
  return new Date().toString();
}

function sayHello() {
  return "Hello from Functions.js"
}

/* Export one or more functions */
export {getTime, sayHello} //no semicolon at end


/* You can also prepend a function with export */
export function sayGoodbye() {
  return "Goodbye from Functions.js";
}