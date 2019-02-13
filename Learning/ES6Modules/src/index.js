/* Module Notes
 * Variable definitions are scoped to the module
 * File paths are relative to the importing file
 * Modules are singletons. Even if a module is imported multiple times, only a single “instance” of it exists.
 * There are two kinds of exports: named exports (several per module) and default exports (one per module).
 * /

/* Imports and exports must be at the top level, the following is not valid: */
// if (1 == 1) {
//   import * as fns from './Functions';
// }

/* Imports are hoisted (internally moved to the beginning of the current scope).
   To avoid confusion, all imports should be at the top of the file.
   This will work: */
// console.log(`PI: ${fns.PI}`);
// import * as fns from './Functions';


 /* Import the exported functions from Functions into the current namespace */
import {getTime, sayHello, sayGoodbye} from './Functions';
console.log(`sayGoodbye: ${sayGoodbye()}`);

/* You can import multiple properties at once */
import * as fns from './Functions';
console.log(`sayHello: ${fns.sayHello()}`);
//PI is not defined, because it was not exported in Functions.js
console.log(`PI: ${fns.PI}`);

/* Import default function */
import myFn from './Functions2'
console.log(`Functions2: ${myFn()}`);

/* Import a class */
import ES6Class from './ES6Class';
var es6Class = new ES6Class();
console.log(`Es6Class: ${es6Class.sayHi()}`);

/* Modules maintain state, but the state is not shared between files importing state.js */
import * as state from './state.js';
console.log(`curr count: ${state.counter}`);
console.log(`curr count: ${state.incCounter()}`);
console.log(`curr count: ${state.incCounter()}`);

/* Modules can have child modules */
import * as childParent from './parent.js';
console.log(`Import from parent: ${childParent.helloFromParent()}`);
console.log(`Import from child: ${childParent.helloFromChild()}`);