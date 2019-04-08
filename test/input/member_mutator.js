class A {
  get x() {
    return this._x || 1
  }

  get ['y' + '1']() {
    return 2
  }

  set x(v = 2) {
    this._x = v
  }

  method() {
    console.log('method')
  }
}
