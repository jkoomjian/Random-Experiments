class Transform {
  constructor(transformStr) {
    this.transformStr = transformStr;
    this.transformParts = transformStr.split(" ");
    this.transform = {};
    this.transformParts.forEach( part => {this._addProp(part)} );
  }

  _addProp(part) {
    var r = new RegExp("(.+?)\\((.+?)\\)", 'g').exec(part);
    if (r && r.length > 1) this.transform[ r[1] ] = r[2];
  }

  getPropValueInDegree(prop) {
    var result = this.transform[prop];
    result = result.replace("deg", "");
    result = parseInt(result, 10);
    return result;
  }

  toString() {
    var tmpArray = [];
    Object.keys(this.transform).forEach( key => {
      tmpArray.push(`${key}(${this.transform[key]})`);
    });
    return tmpArray.join(" ");
  }

}