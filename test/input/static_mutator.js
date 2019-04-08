class A {
  get x() {
    return this._x;
  }

  static set x(v) {
    return A._x = v;
  }

  static get x() {
    return A._x || 1;
  }
}
