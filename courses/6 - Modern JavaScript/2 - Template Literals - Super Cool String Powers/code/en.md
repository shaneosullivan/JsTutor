---
version: 1
---

```javascript
// Template literals - the super cool way to work with text!

let playerName = "Luna";
let playerLevel = 5;
let playerHealth = 100;

// OLD WAY - lots of + signs and quotes (boring!)
let oldMessage = "Player " + playerName + " is level " + playerLevel + " with " + playerHealth + " health points.";
printData("Old way: " + oldMessage);

// NEW WAY - template literals with backticks and ${} (awesome!)
let newMessage = `Player ${playerName} is level ${playerLevel} with ${playerHealth} health points.`;
printData("New way: " + newMessage);

// You can do math inside the ${}!
let totalScore = `${playerName} has ${playerLevel * 100} total experience points!`;
printData("Math inside: " + totalScore);

// Multi-line messages are easy too!
let storyMessage = `
🏰 Welcome to the Adventure Game!
   Player: ${playerName}
   Level: ${playerLevel}
   Health: ${playerHealth}/100
   
   Ready for your quest?
`;
printData("Multi-line story:");
printData(storyMessage);

// Try creating your own template literal!
let yourName = "Put your name here";
let yourAge = 9;
let yourMessage = `Hi! I'm ${yourName} and I'm ${yourAge} years old. I love coding!`;
printData("Your message: " + yourMessage);
```