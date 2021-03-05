---
title: Excuse me？这个前端面试在搞事！
date: '2019-4-01 08:00:00'
sidebar: 'auto'
categories:
 - javascript
tags:
 - javascript
 - 异步
 - 面试
publish: true
---
金三银四搞事季，前端这个近年的热门领域，搞事气氛特别强烈，我朋友小伟最近就在疯狂面试，遇到了许多有趣的面试官，有趣的面试题，我来帮这个搞事 boy 转述一下。

>以下是我一个朋友的故事，真的不是我。
```js
for (var i = 0; i < 5; i++) {
  console.log(i);
}
```
“小伟，你说说这几行代码会输出什么？”

当面试官在 Sublime 打出这几行代码时，我竟有点蒙蔽。蛤？这不是最简单的一个循环吗？是不是有陷阱啊，我思索一下，这好像和我看的那个闭包的题很像啊，这面试官是不是没写完啊？有毒啊。

“应该是直接输出 0 到 4 吧...”，我弱弱的说到。

“是啊，别紧张，这题没啥陷阱，我就是随便写一下。”

（Excuse me？面试官你是来搞笑的吗，吓死老子了！）

“那你在看看这几行代码会输出什么？”
```js
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000 * i);
}
```
额，什么鬼，怎么还不是我背了那么多遍的那道闭包题，让我想想。 setTimeout 会延迟执行，那么执行到 console.log 的时候，其实 i 已经变成 5 了，对，就是这样，这么简单怎么可能难到老子。

“应该是开始输出一个 5，然后每隔一秒再输出一个 5，一共 5 个 5。”

“对，那应该怎么改才能输出 0 到 4 呢？”

终于到我熟悉的了，加个闭包就解决了，稳！
```js
for (var i = 0; i < 5; i++) {
  (function(i) {
    setTimeout(function() {
      console.log(i);
    }, i * 1000);
  })(i);
}
```
“很好，那你能说一下，我删掉这个 i 会发生什么吗？”
```js
for (var i = 0; i < 5; i++) {
  (function() {
    setTimeout(function() {
      console.log(i);
    }, i * 1000);
  })(i);
}
```
“这样子的话，内部其实没有对 i 保持引用，其实会变成输出 5。”

“很好，那我给你改一下，你看看会输出什么？”
```js
for (var i = 0; i < 5; i++) {
  setTimeout((function(i) {
    console.log(i);
  })(i), i * 1000);
}
```
蛤？什么鬼，这是什么情况，让我想想。这里给 setTimeout 传递了一个立即执行函数。额，setTimeout 可以接受函数或者字符串作为参数，那么这里立即执行函数是个啥呢，应该是个 undefined ，也就是说等价于：

setTimeout(undefined, ...);
而立即执行函数会立即执行，那么应该是立马输出的。

“应该是立马输出 0 到 4 吧。”

“哎哟，不错哦，最后一题，你对 Promise 了解吧？”

“还可以吧...”

“OK，那你试试这道题。”
```js
setTimeout(function() {
  console.log(1)
}, 0);
new Promise(function executor(resolve) {
  console.log(2);
  for( var i=0 ; i<10000 ; i++ ) {
    i == 9999 && resolve();
  }
  console.log(3);
}).then(function() {
  console.log(4);
});
console.log(5);
```
WTF！！！！我想静静！

这道题应该考察我 JavaScript 的运行机制的，让我理一下思路。

首先先碰到一个 setTimeout，于是会先设置一个定时，在定时结束后将传递这个函数放到任务队列里面，因此开始肯定不会输出 1 。

然后是一个 Promise，里面的函数是直接执行的，因此应该直接输出 2 3 。

然后，Promise 的 then 应当会放到当前 tick 的最后，但是还是在当前 tick 中。

因此，应当先输出 5，然后再输出 4 。

最后在到下一个 tick，就是 1 。

“2 3 5 4 1”

“好滴，等待下一轮面试吧。”


So easy！妈妈再也不用担心我的面试了。