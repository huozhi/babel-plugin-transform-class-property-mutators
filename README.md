# babel-transform-class-property-mutators

### About

babel helper class transform will define getter/setter with `createClass` helper.
which getter/setter are created when helper executed. and they're naming in literals.
which block some further optimization.

### Example

**In**

```js
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
```

**Out**

```js
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
```



