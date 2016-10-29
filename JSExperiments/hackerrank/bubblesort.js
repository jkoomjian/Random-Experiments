function bubbleSort(str) {
  var strA = str.split('');

  for (let i=0; i<str.length; i++) {
// debugger
    for (let j=0; j<strA.length-1; j++) {
      let first = strA[j];
      let last = strA[j+1];
      if (first > last) {
        strA[j] = last;
        strA[j+1] = first;
      }
    }

  }

  return strA.join("");
}
console.log( bubbleSort("coderbyte") );