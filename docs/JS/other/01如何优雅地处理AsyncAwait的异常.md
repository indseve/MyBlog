---
title: 如何优雅地处理Async/Await的异常？
date: '2018-11-6 08:00:00'
sidebar: 'auto'
categories:
 - javascript
tags:
 - javascript
 - promise
 - 异步
 - async/await
publish: true
---

async/await 中的异常处理很让人混乱。尽管有很多种方式来应对async 函数的异常，但是连经验丰富的开发者有时候也会搞错。

假设你有一个叫做run()的异步函数。在本文中，我会描述 3 种方式来处理run()的异常情形： try/catch, Go 语言风格, 函数调用的时候使用 catch()(即run().catch())。 我会跟你解释为什么其实几乎只需要catch()就足够。

## ```try/catch```
当你第一次使用async/await, 你可能尝试使用try/catch将每一个 async 操作包围起来。如果你await一个被 reject 的 Promise，JavaScript 会抛出一个可以被捕获的错误。
```js
run();
​
async function run() {
    try {
        await Promise.reject(new Error("Oops!"));
    } catch (error) {
        error.message; // "Oops!"
    }
}
```
```try/catch``` 能够捕获非异步的异常。
```js
run();
​
async function run() {
    const v = null;
    try {
        await Promise.resolve("foo");
        v.thisWillThrow;
    } catch (error) {
        // "TypeError: Cannot read property 'thisWillThrow' of null"
        error.message;
    }
}
```
所以，只需要将所有的代码逻辑都用 try/catch包围起来就可以搞定？也不完全正确。下面的代码会抛出unhandled promise rejection. await将一个被拒绝的 promise 转换为可捕获的错误，但是 return 不行。
```js
run();
​
async function run() {
    try {
        // 注意这里是return,不是await
        return Promise.reject(new Error("Oops!"));
    } catch (error) {
        // 代码不会执行到这里
    }
}
```
也不可能使用 return await来绕开。

还有一个缺点就是使用了try/catch 之后，就很难用.的语法来进行 Promise 链式组合了。

## 使用 Go 的语法
另一个常见的方式就是使用then()将一个本来需要用catch()来捕获并处理的 Promise 转换为普通的 Promise。然后像 Go 语言中一样，使用if(err)来处理异常。
```js
run();
​
async function throwAnError() {
    throw new Error("Oops!");
}
​
async function noError() {
    return 42;
}
​
async function run() {
    // The `.then(() => null, err => err)` 来匹配正常/异常的情况。如果正常情况，返回`null`；如果异常，返回`err`
    let err = await throwAnError().then(() => null, err => err);
    if (err != null) {
        err.message; // 'Oops'
    }
​
    err = await noError().then(() => null, err => err);
    err; // null
}
```
如果你真的想要同时返回 error 和正确的值，你可以完全假装在用 Go 语言。
```js
run();
​
async function throwAnError() {
    throw new Error("Oops!");
}
​
async function noError() {
    return 42;
}
​
async function run() {
    // The `.then(v => [null, v], err => [err, null])` pattern
    // 你可以使用数组解构来匹配err和返回值
    let [err, res] = await throwAnError().then(
        v => [null, v],
        err => [err, null]
    );
    if (err != null) {
        err.message; // 'Oops'
    }
​
    err = await noError().then(v => [null, v], err => [err, null]);
    err; // null
    res; // 42
}
```
使用 Go 语言风格的错误处理并不能摆脱return无法捕获的情况。而且还让整个代码更加的复杂，如果忘记```if(err != null)```，就会出问题。

总的来说，有两大缺点：

代码极度重复，每一个地方都少不了```if (err != null) ```，真的很累，而且容易漏掉；
run()函数中的非异步的错误也无法处理；
总的来说，它并没有比try/catch好多少。

## 在函数调用的时候使用catch()
try/catch 和 Go 语言风格的异常处理都有各自的使用场景，但是处理所有异常最好的方法是在run()函数的后面使用catch()，像这样:run().catch()。换句话说，用一个catch()来处理run函数中的所有错误，而不是针对run里面的每一种情况都去写代码做相应的处理。
```js
run()
    .catch(function handleError(err) {
        err.message; // Oops!
    })
    // 在handleError中处理所有的异常
    // 如果handleError出错，则退出。
    .catch(err => {
        process.nextTick(() => {
            throw err;
        });
    });
​
async function run() {
    await Promise.reject(new Error("Oops!"));
}
```
记住，async 函数总是返回 promise。只要函数中有异常，Promise 会 reject。而且，如果一个 async 函数返回的是一个 reject 的 Promise，那么这个 Promise 依然会继续被 reject。
```js
run()
    .catch(function handleError(err) {
        err.message; // Oops!
    })
    .catch(err => {
        process.nextTick(() => {
            throw err;
        });
    });
​
async function run() {
    // 注意：这里使用了return，而不是await
    return Promise.reject(new Error("Oops!"));
}
```
为什么使用run().catch()而不是将整个run()函数用try/catch包起来呢？我们首先来考虑一个情况：如果try/catch的catch部分有异常，我们应该如何处理呢？只有一个方法：在catch里面接着使用try/catch。所以，run().catch()的模式使得异常处理变得非常简洁。

## 总结
我们最好是全局的有一个 errorHandler 来处理那些没有考虑到的异常，比如使用run().catch(handleError)，而不是在run()函数里面所有可能出错的地方加上try/catch。
