class A {}

Object.defineProperties(A, {
  x: {
    set: function (v) {
      return A._x = v;
    },
    get: function () {
      return A._x || 1;
    },
    configurable: true,
    enumerable: true
  }
})
Object.defineProperties(A.prototype, {
  x: {
    get: function () {
      return this._x;
    },
    configurable: true,
    enumerable: true
  }
})