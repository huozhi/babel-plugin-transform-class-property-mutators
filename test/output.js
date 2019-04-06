class A {
  method() {
    console.log('method');
  }

}

Object.defineProperties(A.prototype, {
  x: {
    get: function () {
      return this._x || 1;
    },
    set: function (v = 2) {
      this._x = v;
    },
    configurable: true,
    enumerable: true
  },
  ['y' + '1']: {
    get: function () {
      return 2;
    },
    configurable: true,
    enumerable: true
  }
})
