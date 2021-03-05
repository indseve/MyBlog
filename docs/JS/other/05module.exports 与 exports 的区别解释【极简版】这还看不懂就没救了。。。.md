---
title: module.exports 与 exports 的区别解释【极简版】这还看不懂就没救了。。。
date: '2018-12-01 08:00:00'
sidebar: 'auto'
categories:
 - javascript
tags:
 - javascript
 - esm
 - cjm
publish: true
---
```js
// -------- node.js core --------

var module = {
  exports: {

  }
};

exports = module.exports;

// -------- 下面正常写代码 --------

exports.name = 'Alan';
exports.test = function () {
  console.log('hi')
};

// 给导出的对象添加属性，直接这样就好了
console.log(module) // { exports: { name: 'Alan', test: [Function] } }

exports = {
  name: 'Bob',
  add: function (a, b) {
    return a + b;
  }
}

// 不过 ① exports 是一个引用，直接赋值给它，只是让这个变量等于另外一个引用
console.log(exports) // { name: 'Bob', add: [Function] }
// 并不会修改到导出的对象
console.log(module) // { exports: { name: 'Alan', test: [Function] } }

module.exports = {
  name: 'Bob',
  add: function (a, b) {
    return a + b;
  }
}

// ∵① 所以 只有通过 module.exports 才能真正修改到 exports 本身
console.log(module) // { exports: { name: 'Bob', add: [Function] } }
```