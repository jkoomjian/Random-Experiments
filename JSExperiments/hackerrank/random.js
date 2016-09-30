function fizzBuzz() {

  for (let i=0; i<100; i++) {

    if ( (i % 3) === 0 && (i % 5) === 0 ) {
      console.log("fizzbuzz");
    } else if ( (i % 3) === 0) {
      console.log("fizz");
    } else if ( (i % 5) === 0) {
      console.log("buzz");
    } else {
      console.log(i + "");
    }
  }
}
fizzBuzz();


String.prototype.repeatify = function(count) {
  var out = "";
  for (let i=0; i<count; i++) {
    out += this.toString();
  }
  return out;
}


function isPalindrome(str) {
  while (str.length >= 2) {
    if (str[0] === str[str.length-1]) {
      str = str.slice( 1, str.length-1 );
    } else {
      return false;
    }
  }
  return true;
}