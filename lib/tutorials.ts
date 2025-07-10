import type { Tutorial } from "@shared/schema";

export const TUTORIAL_DESCRIPTIONS = {
  1: {
    tips: [
      "Variables are like labeled boxes that store information",
      "Use 'let' to create a new variable",
      "Try changing the values and see what happens!",
    ],
    examples: [
      "let myAge = 9;",
      "let favoriteColor = 'blue';",
      "let isHappy = true;",
    ],
  },
  2: {
    tips: [
      "JavaScript can do maths just like a calculator",
      "Use + for addition, - for subtraction",
      "Use * for multiplication, / for division",
    ],
    examples: [
      "let sum = 5 + 3; // equals 8",
      "let product = 4 * 6; // equals 24",
      "let half = 10 / 2; // equals 5",
    ],
  },
  3: {
    tips: [
      "if/else lets your code make decisions",
      "The condition goes inside parentheses ()",
      "Use === to check if two things are equal",
    ],
    examples: [
      "if (age > 10) { ... }",
      "if (color === 'red') { ... }",
      "if (isHappy) { ... } else { ... }",
    ],
  },
  4: {
    tips: [
      "Functions are like recipes that you can reuse",
      "Give your function a name that describes what it does",
      "Call a function by writing its name followed by ()",
    ],
    examples: [
      "function sayHello() { ... }",
      "function drawStar(x, y) { ... }",
      "drawStar(100, 100);",
    ],
  },
  5: {
    tips: [
      "while loops repeat code as long as something is true",
      "Be careful not to create infinite loops!",
      "Use a counter to control how many times it runs",
    ],
    examples: [
      "let count = 0;",
      "while (count < 10) { ... }",
      "count = count + 1;",
    ],
  },
  6: {
    tips: [
      "for loops are great when you know how many times to repeat",
      "The loop variable (usually 'i') counts for you",
      "Use the counter to change what happens each time",
    ],
    examples: [
      "for (let i = 0; i < 5; i++) { ... }",
      "for (let i = 1; i <= 10; i++) { ... }",
      "drawCircle(i * 50, 100, 20, 'red');",
    ],
  },
  7: {
    tips: [
      "Arrays are like lists that can hold many items",
      "Use square brackets [] to create an array",
      "Access items by their position (starting from 0)",
    ],
    examples: [
      "let colors = ['red', 'blue', 'green'];",
      "colors[0] // gets 'red'",
      "colors.length // gets 3",
    ],
  },
  8: {
    tips: [
      "Combine loops and arrays to create patterns",
      "Use maths to calculate positions and sizes",
      "Experiment with different colors and shapes",
    ],
    examples: [
      "for (let x = 0; x < 8; x++) { ... }",
      "let color = colors[x % colors.length];",
      "drawRect(x * 50, y * 50, 50, 50, color);",
    ],
  },
  9: {
    tips: [
      "Animation is just drawing many pictures quickly",
      "Use Math.sin() and Math.cos() for smooth movement",
      "setInterval() runs code repeatedly",
    ],
    examples: [
      "let time = 0;",
      "let x = 200 + Math.sin(time) * 100;",
      "time += 0.1;",
    ],
  },
  10: {
    tips: [
      "Combine everything you've learned!",
      "Start simple and add features one at a time",
      "Don't forget to test your code often",
    ],
    examples: [
      "let score = 0;",
      "function updateGame() { ... }",
      "if (playerClicked) { score++; }",
    ],
  },
};

export function getTutorialHelp(tutorial: Tutorial) {
  return (
    TUTORIAL_DESCRIPTIONS[
      tutorial.order as keyof typeof TUTORIAL_DESCRIPTIONS
    ] || {
      tips: [
        "Try the example code first",
        "Read the instructions carefully",
        "Don't be afraid to experiment!",
      ],
      examples: ["// Your code goes here"],
    }
  );
}
