---
version: 1
---

```javascript
// Async/Await - making promises super easy!

printData("=== Learning About Async/Await ===");

// Helper function that returns a promise
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// OLD WAY - Using promises with .then()
function oldWayExample() {
  printData("🔄 Old way starting...");
  
  delay(500)
    .then(() => {
      printData("🕐 Step 1 done (old way)");
      return delay(500);
    })
    .then(() => {
      printData("🕑 Step 2 done (old way)");
      return delay(500);
    })
    .then(() => {
      printData("✅ All steps done (old way)");
    });
}

// NEW WAY - Using async/await (much cleaner!)
async function newWayExample() {
  printData("🚀 New way starting...");
  
  await delay(500);
  printData("🕐 Step 1 done (new way)");
  
  await delay(500);
  printData("🕑 Step 2 done (new way)");
  
  await delay(500);
  printData("✅ All steps done (new way)");
}

// Async function that handles errors
async function handleErrorsExample() {
  printData("🎯 Learning error handling...");
  
  try {
    // This promise might fail
    const result = await new Promise((resolve, reject) => {
      if (Math.random() > 0.5) {
        resolve("🎉 Success!");
      } else {
        reject("😞 Something went wrong!");
      }
    });
    
    printData("Result: " + result);
  } catch (error) {
    printData("Caught error: " + error);
  }
}

// Async function that returns a value
async function getValue() {
  await delay(300);
  return "🌟 This is a value from an async function!";
}

// Using the async function
async function useAsyncFunction() {
  const value = await getValue();
  printData("Got value: " + value);
}

// Running all examples
oldWayExample();
newWayExample();
handleErrorsExample();
useAsyncFunction();

printData("📋 All async examples are running...");
```