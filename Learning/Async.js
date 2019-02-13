/**
 * Async is an improvement over promises.
 * Available in Node 7.7+
 * Works similarly to generators, suspending execution in your context until the promise settles.
 * If the awaited expression isn’t a promise, its casted into a promise.
 */

const getJson = () {my: 'json'};

 /* Promises version */
 const makeRequest = () =>
  getJSON()
    .then(data => {
      console.log(data)
      return "done"
    })
makeRequest()

/* Async Version */
const makeRequest = async function() {   // prefixing function with 'async' makes it asynchronous
  console.log(await getJSON())              // blocks here until getJson() returns
  return "done"
}
makeRequest()

// To use async, the function must have async in front of it. This makes the whole function asynchrounous.
// Then use await where the actual asynchrounous code is called
// Any function called by

function myAsyncMethod() {
  return new Promise(function(resolve, reject) {
    //your async code goes here
    setTimeout(function() {
      resolve("success");
    }, 3000);
  });
}

let makeRequest = async () => {
  console.log('making async request');
  let myPromiseResult = await myAsyncMethod();
  console.log('myAsyncMethod returned', myPromiseResult);
  console.log('returning done');
  // Never return anything from an async function - it will automatically return a Promise
  return myPromiseResult + "-done";
}
console.log('makeRequest returned: ', makeRequest());

// > console.log('makeRequest returned: ', makeRequest());
// making async request
// makeRequest returned:  Promise { <pending> }
// undefined
// > myAsyncMethod returned success
// returning done

// makeRequest pauses at myAsyncMethod() while the promise resolves
// but makeRequest is an async method - so it doesn't block (returning something doesn't really make sense)
// An Async Function always returns a Promise

// Instead use Promise async functions return
makeRequest().then( (x) => console.log('makeRequest returned: ', x) );
// makeRequest returned:  success-done

// While Async Functions make it easier to write asynchronous code, they also lend themselves to code that is serial.
// That is to say: code that executes one operation at a time. A function with multiple await expressions in it will be
// suspended once at a time on each await expression until that Promise is settled

// To get return values working, the call must be wrapped in an async method and called with await:
let makeRequest2 = async () => {
  let myPromiseResult = await myAsyncMethod();
  return myPromiseResult + "-done";
}
let makeRequest3 = async () => {
  console.log('makeRequest returned: ', await makeRequest2());
}
makeRequest3();

// You can't use await in for loops - loops remain synchronous and will complete before the inner async methods complete
// ES2018 introduces asynchronous iterators, which are just like regular iterators except the next() method returns a Promise. Therefore, the await keyword can be used with for … of loops to run asynchronous operations in series
async function process(array) {
  for await (let i of array) {
    doSomething(i);
  }
}
