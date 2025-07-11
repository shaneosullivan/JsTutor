---
version: 1
---

```javascript
// Let's create a simple algorithm!

// Algorithm: Find the largest number in an array
function findLargest(numbers) {
  let largest = numbers[0]; // Start with the first number

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > largest) {
      largest = numbers[i];
    }
  }

  return largest;
}

// Test our algorithm
let testNumbers = [3, 7, 2, 9, 1, 5];
printData("Numbers to search:");
printData(testNumbers);

let result = findLargest(testNumbers);
printData("Largest number found:");
printData(result);

// Algorithm: Check if a word is a palindrome
function isPalindrome(word) {
  let reversed = word.split("").reverse().join("");
  return word.toLowerCase() === reversed.toLowerCase();
}

// Test palindrome algorithm
let testWords = ["racecar", "hello", "madam", "javascript"];
printData("Testing palindromes:");
testWords.forEach((word) => {
  let result = isPalindrome(word);
  printData(`"${word}" is ${result ? "a palindrome" : "not a palindrome"}`);
});
```
