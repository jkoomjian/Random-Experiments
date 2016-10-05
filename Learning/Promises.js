/*------------------ Promises! ------------------*/
function asyncMethodSucces(callback) { setTimeout(callback, 3000, 'success'); }
function asyncMethodFailure(callback) { setTimeout(callback, 1000, 'fail'); }
function asyncMethodError() { setTimeout(() => {throw new Error("just cause")}, 1000); }

// Promises are built into ES6!
var myPromise = new Promise(function(resolve, reject) {
  //your async code goes here
  asyncMethodSucces(function(status) {
    if (status === "success") {
      resolve("success");
    } else {
      reject(new Error(status));
    }
  });
});

//creating a new promise doesn't do anything - you have to chain it with then()
myPromise.then(
              //success
              function(response) {
                console.log("success: " + response);
              },
              //fail
              function(response) {
                console.log("fail" + response);
              }
            );

// Promise - takes a function which will call the async function, and then call resolve or reject depending on the outcome
var p1 = new Promise((resolve, reject) => {
  asyncMethodSucces( val => {
    if (val == 'success') {
      resolve(val);
    } else {
      reject(val);
    }
  });
});

// Add a handler to the promise being resoved with .then()
//promise.then(fullfilledCallback, rejectedCallback)
p1.then( val => console.log("fulfilled:", val),
         err => console.log("rejected: ", err));

 //You can add a .catch() to the end of a chain of .then()'s and it will catch any error in the chain
 // this is much easier, and how most people do it
 p.then(resolveFunc)
  .then(resolveFunc)
  .catch(errorFunc);

//you can also use catch, instead of errorCallback, or pass null has the handler
var p2 = new Promise((resolve, reject) => {
  asyncMethodError(function() {
    resolve('worked');
  });
});
p2.then( val => console.log("fulfilled:", val) )
   .catch( err => console.log("error: " + err.message) );

//Catch will also catch errors from inside then()
var p3 = new Promise( (resolve, reject) => resolve() );
p3.then( val => console.log("success1") )
   .then( val => {throw new Error("then error")} )
   .then( val => console.log("success2") ) //never reached
   .catch( err => console.log("error: " + err.message) );

//You can transform the value by simply returning a new value
var p3 = new Promise((resolve, reject) => resolve(1));
p3.then( val => {console.log(val); return val;}) //1
  .then( val => val + 1)
  .then( val => val + 1)
  .then( val => console.log(val)); //3

//Use Promise.all() to create a promise which completes when a array of promises completes
//results will be the values, returned in order or execution
function asyncCompletion(val, callback) {
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  var timeout = randomInt(2, 10) * 1000;
  setTimeout(callback, timeout, val, timeout);
}

function getPromise(val) {
  return new Promise((resolve, reject) => {
    asyncCompletion(val, (v, timeout) => {
      console.log("resolved " + v + " after " + timeout);
      resolve(v, timeout);
    });
  });
}

var values = ['one', 'two', 'three', 'four', 'five', 'six'];
var promises = values.map( v => getPromise(v) );
Promise.all(promises)
  .then( results => {
    console.log("completed all promises!");
    results.forEach( e => console.log("result: " + e) );
  });

//Promise.race() is like all(), but will resolve after the first promise in the array completes
var promises2 = values.map( v => getPromise(v) );
Promise.race(promises2)
  .then( results => {
    console.log("completed first promise!");
    results.forEach( e => console.log("result: " + e));
  });