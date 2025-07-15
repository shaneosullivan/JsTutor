---
version: 1
---

```javascript
// Closures - functions that remember things!

printData("=== Learning About Closures ===");

// BASIC CLOSURE EXAMPLE
function outerFunction(x) {
  // This variable is in the outer function
  const outerVariable = x;
  
  // This inner function can "see" the outer variable
  function innerFunction(y) {
    return outerVariable + y; // Uses variable from outer function!
  }
  
  return innerFunction; // Return the inner function
}

const addFive = outerFunction(5);
printData("🔒 Basic Closure:");
printData("addFive(3) = " + addFive(3)); // Result: 8 (5 + 3)
printData("addFive(10) = " + addFive(10)); // Result: 15 (5 + 10)

// COUNTER EXAMPLE - closures remember and can change variables!
function createCounter() {
  let count = 0; // This variable is "private"
  
  return function() {
    count++; // The inner function can change the outer variable!
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

printData("\n🔢 Counter Closures:");
printData("Counter 1: " + counter1()); // 1
printData("Counter 1: " + counter1()); // 2
printData("Counter 1: " + counter1()); // 3

printData("Counter 2: " + counter2()); // 1 (separate counter!)
printData("Counter 2: " + counter2()); // 2

// FUNCTION FACTORY - create customized functions
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const multiplyByTen = createMultiplier(10);

printData("\n🏭 Function Factory:");
printData("Double 6: " + double(6));
printData("Triple 4: " + triple(4));
printData("Multiply 5 by 10: " + multiplyByTen(5));

// PRIVATE VARIABLES - closures can keep secrets!
function createBankAccount(initialBalance) {
  let balance = initialBalance; // This is private!
  
  return {
    deposit: function(amount) {
      balance += amount;
      return `Deposited $${amount}. New balance: $${balance}`;
    },
    withdraw: function(amount) {
      if (amount <= balance) {
        balance -= amount;
        return `Withdrew $${amount}. New balance: $${balance}`;
      } else {
        return `Insufficient funds! Balance: $${balance}`;
      }
    },
    getBalance: function() {
      return balance;
    }
  };
}

const myAccount = createBankAccount(100);
printData("\n💰 Private Variables with Closures:");
printData(myAccount.deposit(50));
printData(myAccount.withdraw(30));
printData(myAccount.withdraw(200)); // Not enough money!
printData("Final balance: $" + myAccount.getBalance());

// CLOSURES IN LOOPS - a tricky example!
function createFunctions() {
  const functions = [];
  
  for (let i = 0; i < 3; i++) {
    functions.push(function() {
      return `Function ${i}`; // Each function remembers its own i!
    });
  }
  
  return functions;
}

const funcs = createFunctions();
printData("\n🔄 Closures in Loops:");
printData("Function 0: " + funcs[0]());
printData("Function 1: " + funcs[1]());
printData("Function 2: " + funcs[2]());

// PRACTICAL EXAMPLE - remember user preferences
function createUserPreferences(username) {
  let preferences = {
    theme: 'light',
    language: 'English'
  };
  
  return {
    getPreference: function(key) {
      return `${username}'s ${key}: ${preferences[key]}`;
    },
    setPreference: function(key, value) {
      preferences[key] = value;
      return `${username}'s ${key} set to: ${value}`;
    }
  };
}

const alicePrefs = createUserPreferences('Alice');
printData("\n👤 User Preferences:");
printData(alicePrefs.getPreference('theme'));
printData(alicePrefs.setPreference('theme', 'dark'));
printData(alicePrefs.getPreference('theme'));

printData("\n🎯 Closures help functions remember important information!");
```