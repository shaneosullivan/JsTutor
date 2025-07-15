---
version: 1
---

```javascript
// Promises - making promises to do things later!

printData("=== Learning About Promises ===");

// Let's create a simple promise that always succeeds
const simplePromise = new Promise((resolve, reject) => {
  // This is like saying "I promise to give you a cookie!"
  resolve("🍪 Here's your cookie!");
});

// Using .then() to handle success
simplePromise.then((result) => {
  printData("Promise succeeded: " + result);
});

// Let's create a promise that might fail
const riskyPromise = new Promise((resolve, reject) => {
  const random = Math.random(); // Random number between 0 and 1
  
  if (random > 0.5) {
    resolve("🎉 Lucky! You got a prize!");
  } else {
    reject("😞 Sorry, no prize this time.");
  }
});

// Using .then() and .catch() to handle both success and failure
riskyPromise
  .then((result) => {
    printData("Success: " + result);
  })
  .catch((error) => {
    printData("Failure: " + error);
  });

// A promise that simulates waiting (like loading something)
const waitingPromise = new Promise((resolve, reject) => {
  // Simulate waiting by using setTimeout
  setTimeout(() => {
    resolve("⏰ I'm done waiting!");
  }, 1000); // Wait 1 second
});

waitingPromise
  .then((result) => {
    printData("After waiting: " + result);
  })
  .catch((error) => {
    printData("Something went wrong: " + error);
  })
  .finally(() => {
    printData("✅ Promise is completely finished!");
  });

// Chaining promises (doing things in order)
const step1 = () => Promise.resolve("Step 1 complete!");
const step2 = () => Promise.resolve("Step 2 complete!");
const step3 = () => Promise.resolve("Step 3 complete!");

step1()
  .then((result) => {
    printData(result);
    return step2();
  })
  .then((result) => {
    printData(result);
    return step3();
  })
  .then((result) => {
    printData(result);
    printData("🎯 All steps completed!");
  });

printData("📋 Promise examples are running...");
```