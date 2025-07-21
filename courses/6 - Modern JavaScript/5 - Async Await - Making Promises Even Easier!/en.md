---
id: "async-await-making-promises-even-easier"
courseId: "modern-javascript"
title: "Async Await - Making Promises Even Easier!"
description: "Learn about async/await - the super easy way to work with promises!"
expectedOutput: "Messages showing how async/await makes promises simpler to use"
order: 5
version: 1
---



## What is Async/Await?

Remember promises? They're cool, but sometimes they can get messy with all those `.then()` and `.catch()` chains. **Async/Await** is a **super easy** way to work with promises that makes your code look almost like regular code!

### 🤔 Why is Async/Await Better?

With promises, you had to write:
```javascript
promise.then(result => {
  // do something
}).catch(error => {
  // handle error
});
```

With async/await, you can write:
```javascript
try {
  const result = await promise;
  // do something
} catch (error) {
  // handle error
}
```

Much cleaner! 🎉

### 🎯 The Magic Words:

- **`async`** - Put this before a function to say "This function uses await"
- **`await`** - Put this before a promise to say "Wait for this to finish"

### 📝 Rules for Async/Await:

1. You can only use `await` inside an `async` function
2. `await` makes your code **wait** for a promise to finish
3. Use `try/catch` to handle errors (instead of `.catch()`)
4. Async functions **always** return a promise

### 🚀 Your Mission:

Learn to use async/await to make working with promises super easy!