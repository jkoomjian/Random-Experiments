/*------------------ Promises! ------------------*/
function asyncMethodSuccess(callback) { setTimeout(callback, 3000, 'success'); }
function asyncMethodFailure(callback) { setTimeout(callback, 1000, 'fail'); }

// Promises are built into ES6!
var myPromise = new Promise(function(resolve, reject) {
  //your async code goes here
  asyncMethodSuccess(function(status) {
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
  asyncMethodSuccess( val => {
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
 // p.then(resolveFunc)
 //  .then(resolveFunc)
 //  .catch(errorFunc);

// you can also use catch, instead of errorCallback, or pass null has the handler
// The catch() method returns a Promise and deals with rejected cases only.
// It behaves the same as calling Promise.prototype.then(undefined, onRejected).
var p2 = new Promise( (resolve, reject) => {
    asyncMethodSuccess( () => {
      try {
        throw new Error("just cause");
      } catch(ex) {
        console.log("rejecting promise!");
        reject(ex);
      }
    });
});
(p2.then( val => console.log("fullfilled, should never be called: " + val) )
   .catch( err => console.log("caught error: " + err.message) ));

(Promise.reject('rejected')
  .then( (val) => console.log("resolved") )
  .catch( (err) => console.log("caught error: " + err) ))

let p25 = new Promise( (resolve, reject) => {throw new Error("just cause2")} );
(p25.then( (val) => console.log("resolved") )
  .catch( (err) => console.log("caught error: " + err) ));


//Catch will also catch errors from inside then()
(Promise.resolve()
   .then( val => console.log("success1") )
   .then( val => {throw new Error("then error")} )
   .then( val => console.log("success2") ) //never reached
   .catch( err => console.log("error: " + err.message) ));

//You can transform the value by simply returning a new value
(Promise.resolve(1)
  .then( val => {console.log(val); return val;}) //1
  .then( val => val + 1)  //1 line fat arrow functions automatically return last value
  .then( val => val + 1)
  .then( val => console.log(val))); //3

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

// Promises are in one of 3 states - pending, fulfilled, rejected
// Constructors are passed a callback with resolve and reject params
var p101 = new Promise( (resolve, reject) => {/* Async logic here, calls either resolve() or reject() */});

// If the promise has already been fulfilled or rejected when a handler is attached, the handler will be called immediatly
// there is no race condition between an asynchronous operation completing and its handlers being attached.

// If you have a value, and you arent sure if it is a promise, use Promise.resolve
(Promise.resolve('adsf') //now a resolved promise
        .then( msg => {
          // then called, even though it was attached after promise was resolved
          console.log(`Promise resolved w/message: ${msg}`);
        }));

// Returning promises - if .then() returns a value, it wlll be evaluated by the next .then() in the chain
// if .then() doesn't return a value, the next .then() will run, but it will have a msg value of undefined
(Promise.resolve('asdf')
    .then( msg => {console.log(`Promise resolved w/message: `, msg); return 'qwer';})
    .then( msg => console.log(`Promise2 resolved w/message: `, msg)));
// Promise resolved w/message:  asdf
// Promise2 resolved w/message:  qwer

(Promise.resolve('asdf')
    .then( msg => console.log(`Promise resolved w/message: `, msg))
    .then( msg => console.log(`Promise resolved w/message: `, msg)));
// Promise resolved w/message:  asdf
// Promise resolved w/message:  undefined
