// Destructuring
var a = 1, b = 2, c = 3;
var ar = {a , b, c}
ar // { a: 1, b: 2, c: 3}

var {x, z} = {x: 1, y: 2, z: 3};
console.log(x, y, z); // 1, undefined, 3

// Can also rename variables with { name_of_obj_property: name_of_var }
var { x: i, z: k } = {x: 1, y: 2, z: 3};
console.log(i, k, x); // 1, 3, undefined

// Deep destructuring:

// ES6
var { op: a, lhs: { op: b }, rhs: c } = getASTNode()

// Without ES6
var tmp = getASTNode();
var a = tmp.op;
var b = tmp.lhs.op;
var c = tmp.rhs;

// Assigning methods
// http://es6-features.org/#MethodProperties
{
  x: 1,
  keyName () {...},
  y: 2
}

// Spread Operator
// like the explode from ruby or php
let cold = ['autumn', 'winter'];
let warm = ['spring', 'summer'];
[...cold, ...warm] // => ['autumn', 'winter', 'spring', 'summer']


// Destructuring Object Literals
return {
		// with property value shorthand
		// syntax, you can omit the property
		// value if key matches variable
		// name
		make,  // same as make: make
		model, // same as model: model
		value, // same as value: value

		// computed values now work with
		// object literals
		['make' + make]: true,

		// Method definition shorthand syntax
		// omits `function` keyword & colon
		depreciate() {
			this.value -= 2500;
		}
};

arr = {first: 'f', second: 's', third: 't'}
// var names much match keys in array
let {myF, myS} = arr;
myF; // undefined
let {first, second} = arr;
first // 'f'

// Destructuring Complex Objects
arrSub = {hello: {hey: 'world'}}
let {hello: {hey}} = arrSub;
hey; // world


// Destructuring Arrays
ar = ['1','2','3']
let [one, two] = ar;
one // '1'
two // '2'

// Destructuring Array with Spread
let [one, ...two] = ar;
one // '1'
two // ['2', '3']