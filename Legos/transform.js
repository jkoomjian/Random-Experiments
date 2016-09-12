class Transform {
  constructor(transformStr) {
    this.transformStr = transformStr;
    this.transform = {};
    this._addProps();
  }

  _addProps() {
    var parts = this.transformStr.match(/[^\s]+?\([^\)]+?\)/g);
    parts.forEach( part => {
      var r = new RegExp("(.+?)\\((.+?)\\)", 'g').exec(part);
      if (r && r.length > 1) this.transform[ r[1] ] = r[2];
    });
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