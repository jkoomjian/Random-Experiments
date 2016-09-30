class Link {
  constructor(value) {
    this.value = value;
    this.next;
  }
  toString() {
    return `val: ${this.value}`;
  }
}

class LinkedList {

  constructor() {
    this.data = [];
    this.first;
    this.last;
  }

  add(value) {
    var link = new Link(value);

    if (!this.first) {
      this.first = link;
    }

    if (this.last) {
      this.last.next = link;
    }

    this.last = link;
    this.data.push(link);
  }

  get(index) {
    let currLink = this.first;
    for (let i=0; i<=index; i++) {
      if (i == index) {
        return currLink;
      } else {
        if (!currLink.next) return null;
        currLink = currLink.next;
      }
    }
    return null;
  }

  find(value) {
    let currLinkBefore = null;
    let currLink = this.first;
    while(true) {
      if (currLink.value == value) {
        return [currLink, currLinkBefore];
      } else {
        if (!currLink.next) return [null, null];
        currLinkBefore = currLink;
        currLink = currLink.next;
      }
    }
    return [null, null];
  }

  remove(value) {
    var [curr, before] = this.find(value);
    before.next = curr.next;
  }

  toString() {
    var curr;
    var outs = [];
    do {
      curr = curr ? curr.next : this.first;
      outs.push( curr.toString() );
    } while(curr.next)
    return outs.join(", ");
  }

  reverse() {
    var q = [];
    if (!this.first) return;

    var curr;
    do {
      curr = curr ? curr.next : this.first;
      q.push(curr);
    } while(curr.next)

    while(q.length - 1 > 0) {
      curr = q.pop();
      let prev = q.pop();
      curr.next = prev;
      q.push(prev);
    }

    this.first = this.last;
    this.last = q.pop();
    this.last.next = null;
  }
}

var list = new LinkedList();
list.add("one");
list.add("two");
list.add("three");
list.add("four");
[0,1,2,3,5].forEach( i => console.log( list.get(i) + "" ) );
var [curr, before] = list.find("three");
console.log(`curr: ${curr}, before: ${before}`);
list.remove("three")
console.log( list + "");
list.reverse();
console.log("reversed: " + list);