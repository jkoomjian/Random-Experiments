/*------- Subclassing In Javascript ---------*/

// Utility - merge a map into this object
Object.prototype.merge = function(ar2) {
  Object.keys(ar2).forEach( key => {
    if (!this[key]) {
      this[key] = ar2[key];
    }
  });
};


/*------------ Define extends ------------*/
Object.prototype.extends = function(subClass, superClass) {

  //copy over prototype properties
  subClass.prototype.merge( superClass.prototype );

  var sub = new subClass();

  //add in reference to super
  sub.super = new superClass();

  //copy over instance properties
  // superClass.call(sub);  //these to methods work the same
  sub.super.constructor.call(sub);

  //call the constructor again to make sure sub properties override super properties
  // subClass.call(sub);
  sub.constructor.call(sub);

  return sub;
}


/*------------ Test classes ------------*/

// Define the superclass
var SuperClass = function() {
  this.whoami = "superclass";
  this.superHi = "hi from superclass";
}
SuperClass.prototype.sayHi = function() {console.log("hello from super");};
SuperClass.prototype.sayBye = function() {console.log("bye from super");};

// Define the subclass
var SubClass = function() {
  this.whoami = "subclass";
  this.subHi = "hi from superclass";
}
SubClass.prototype.sayWhoAmI = function() {console.log(this.whoami);};
SubClass.prototype.sayWhoIsSuper = function() {console.log(this.super.whoami);};
SubClass.prototype.saySuperHi = function() {console.log(this.superHi);};


/*------------ Run! ------------*/
sub = Object.extends(SubClass, SuperClass);
sub.sayWhoAmI(); //subclass
sub.sayWhoIsSuper(); //superclass
sub.saySuperHi();  //hi from superclass
sub.sayHi(); //hello from super
sub.sayBye(); //bye from super