// Complete courses and tutorials data from the original app

export const courses = [
  {
    id: 1,
    title: "Basics",
    description:
      "Learn the fundamentals of JavaScript programming with visual drawing",
    type: "canvas",
    order: 1,
    requiredCourse: null,
  },
  {
    id: 2,
    title: "Array Methods",
    description:
      "Master array manipulation with forEach, map, filter, and more",
    type: "printData",
    order: 2,
    requiredCourse: 1,
  },
  {
    id: 3,
    title: "DOM Manipulation",
    description: "Learn to interact with web pages and HTML elements",
    type: "iframe",
    order: 3,
    requiredCourse: 1,
  },
  {
    id: 4,
    title: "Algorithms",
    description:
      "Explore problem-solving with recursion and algorithmic thinking",
    type: "printData",
    order: 4,
    requiredCourse: 1,
  },
  {
    id: 5,
    title: "Remote Data",
    description: "Work with APIs and fetch data from servers",
    type: "printData",
    order: 5,
    requiredCourse: 1,
  },
];

export const tutorials = [
  // Basics Course (courseId: 1) - 15 tutorials
  {
    id: 1,
    courseId: 1,
    title: "Your First Variable",
    description: "Learn to store information",
    content: `## What are Variables?

Variables are like **boxes** that hold information. You can put numbers, text, or other things in them and use them later!

### 🎨 About the Drawing Functions:

- \`drawCircle(x, y, radius, color)\` - The first number (\`x\`) is how many pixels from the LEFT edge to place the center. The second number (\`y\`) is how many pixels from the TOP edge. The radius is how big the circle is (like measuring from the center to the edge).
- \`drawText(x, y, text, color)\` - Places text at a position. \`x\` is pixels from left, \`y\` is pixels from top.

### 📍 Canvas Coordinates

Think of the canvas like a grid: \`(0,0)\` is the top-left corner, \`(400,400)\` is the bottom-right!

### 🌟 Your Challenge:

After trying the example, clear the code and write your own! Try creating a variable with your favorite number, then draw a circle using that number. Can you draw your initials on the canvas too?`,
    starterCode: `// Let's create our first variable!
// This grey text is called a 'comment'. It doesn't
// affect the code, it's just for us to read.
// You make one by putting two slashes (//) at 
// the start of a line.

// To create a variable, we use the keyword 'let'
// followed by the name we want to give it.
// Then we put some information inside the
// variable by using the equals sign (=), followed
// by the value we want to store.

let myName = "Your Name";
let age = 9;

// Now let's draw something using our variables
drawCircle(200, 200, age * 5, 'blue');
drawText(200, 300, myName, 'black');`,
    expectedOutput: "A blue circle and your name displayed",
    order: 1,
  },
  {
    id: 2,
    courseId: 1,
    title: "Maths is Fun!",
    description: "Add, subtract, and more",
    content: `## Math Operations in JavaScript

JavaScript can do maths just like you! You can add \`+\`, subtract \`-\`, multiply \`*\`, and divide \`/\` numbers.

### 🎨 New Drawing Function:

- \`drawRect(x, y, width, height, color)\` - Draws a rectangle! \`x\` and \`y\` tell us where the **TOP-LEFT** corner goes. \`width\` is how wide (left to right), \`height\` is how tall (top to bottom). Think of it like drawing a box!

### 🌟 Your Challenge:

Clear the code and try this on your own! Create variables for your age and your favorite number, then do some maths with them. Draw rectangles using the results - maybe make a building or a robot face!`,
    starterCode: `// Let's do some maths and draw with it!
let x = 100;
let y = 150;
let size = 10 + 20; // This equals 30!

drawRect(x, y, size, size, 'red');
drawRect(x + 50, y, size * 2, size, 'green');
drawRect(x + 150, y, size / 2, size, 'blue');`,
    expectedOutput: "Three rectangles of different sizes",
    order: 2,
  },
  {
    id: 3,
    courseId: 1,
    title: "Shortcuts with Math",
    description: "Learn faster ways to do maths with variables",
    content: `## Shortcuts with Math

Sometimes you want to change a variable by adding or subtracting from it. There are shortcuts that make this easier!

### 🚀 Math Shortcuts:

- \`+=\` means 'add to this variable' (like \`score += 10\` means \`score = score + 10\`)
- \`-=\` means 'subtract from this variable' (like \`lives -= 1\` means \`lives = lives - 1\`)
- \`*=\` means 'multiply this variable' (like \`size *= 2\` means \`size = size * 2\`)
- \`/=\` means 'divide this variable' (like \`speed /= 2\` means \`speed = speed / 2\`)

### ✨ Why Use Shortcuts?

- They're faster to type
- They're easier to read
- They help prevent mistakes
- Real programmers use them all the time!

### 🌟 Your Challenge:

Try changing the code to use different shortcuts. What happens if you use \`*=\` instead of \`+=\`? Can you make the squares get smaller instead of bigger?`,
    starterCode: `// Let's practice maths shortcuts!
let score = 0;
let lives = 5;
let size = 20;
let x = 50;

// Show starting values
drawText(50, 50, 'Starting Score: ' + score, 'black');
drawText(50, 70, 'Starting Lives: ' + lives, 'black');

// Using += to add to score
score += 25;  // Same as: score = score + 25
drawRect(x, 100, size, size, 'blue');
drawText(x, 130, 'Score: ' + score, 'blue');

// Using -= to subtract from lives
lives -= 1;  // Same as: lives = lives - 1
x += 80;
drawRect(x, 100, size, size, 'orange');
drawText(x, 130, 'Lives: ' + lives, 'orange');

// Using *= to multiply size
size *= 2;    // Same as: size = size * 2
x += 100;
drawRect(x, 100, size, size, 'red');
drawText(x, 150, 'Size: ' + size, 'red');

// Using /= to divide size back down
size /= 2;    // Same as: size = size / 2
score += 100; // Add bonus points!
x += 120;
drawRect(x, 100, size, size, 'green');
drawText(x, 130, 'Final Score: ' + score, 'green');`,
    expectedOutput: "Three rectangles showing maths shortcuts in action",
    order: 3,
  },
  {
    id: 4,
    courseId: 1,
    title: "Simple Repeating",
    description: "Learn while loops - the easiest way to repeat code",
    content: `## Simple Repeating with While Loops

\`While\` loops are the simplest way to repeat code! They keep going 'while' something is true.

### 🔄 How While Loops Work:

- \`while (condition)\` means 'keep doing this while condition is true'
- We need a **counter variable** to track how many times we've done something
- We **must change the counter** inside the loop or it will go forever!
- Much easier to understand than \`for\` loops

### Basic Structure:

\`\`\`javascript
let i = 0;              // Start counter
while (i < 5) {         // Keep going while true
    // do something
    i += 1;             // IMPORTANT: change counter!
}
\`\`\`

### 🎨 New Drawing Function:

- \`drawLine(x1, y1, x2, y2, color)\` - Draws a line from one point to another! The first two numbers \`(x1, y1)\` are where the line starts, and the next two \`(x2, y2)\` are where it ends.

### 🌟 Your Challenge:

Try changing the condition! What happens if you change \`i < 5\` to \`i < 8\`? Can you make the circles change color each time?`,
    starterCode: `// Let's draw with a while loop!
let i = 0;  // Start counting at 0

while (i < 5) {  // Keep going while i is less than 5
    let x = 50 + i * 60;  // Space circles out
    let y = 200;
    
    drawCircle(x, y, 25, 'blue');
    drawText(x - 5, y + 5, i + 1, 'white');  // Show the number
    
    i += 1;  // Very important! Add 1 to i each time
}

drawText(50, 100, 'Drew ' + i + ' circles!', 'black');`,
    expectedOutput: "5 blue circles in a row with numbers inside",
    order: 4,
  },
  {
    id: 5,
    courseId: 1,
    title: "Advanced Repeating",
    description: "Learn for loops - a more powerful way to repeat",
    content: `## Advanced Repeating with For Loops

\`For\` loops are a more compact way to write loops! They put the counter, condition, and increment all in one line.

### 🚀 For Loop Structure:

\`\`\`javascript
for (start; condition; increment) {
    // code to repeat
}
\`\`\`

Breaking it down:

- \`let i = 0\` (start counting at 0)
- \`i < 5\` (keep going while \`i\` is less than 5)
- \`i++\` (add 1 to \`i\` each time - same as \`i += 1\`)

### 🔄 For vs While:

- **For loops** are more compact when you know how many times to repeat
- **While loops** are clearer when the condition is more complex
- Both do the same thing, just written differently!

### 🌟 Your Challenge:

Try changing the \`for\` loop numbers! What happens if you change \`i < 5\` to \`i < 8\`? Can you make a diagonal pattern by changing the \`y\` position too?`,
    starterCode: `// Let's draw a pattern with a for loop!
for (let i = 0; i < 5; i++) {
    let x = i * 60;
    let y = i * 40;
    drawRect(x, y, 40, 40, 'purple');
    drawCircle(x + 20, y + 20, 15, 'yellow');
}

// Compare to while loop way:
// let i = 0;
// while (i < 5) {
//     let x = i * 60;
//     let y = i * 40;
//     drawRect(x, y, 40, 40, 'purple');
//     drawCircle(x + 20, y + 20, 15, 'yellow');
//     i++;
// }`,
    expectedOutput: "A diagonal pattern of purple squares with yellow circles",
    order: 5,
  },
  {
    id: 6,
    courseId: 1,
    title: "Making Decisions",
    description: "Computer choices with if statements",
    content: `## 🤔 What are IF statements?

Sometimes your program needs to make choices! An \`if\` statement lets the computer ask a question and then decide what to do based on the answer.

### 📝 Basic IF Syntax:

\`\`\`javascript
if (condition) {
    // code to run if condition is true
}
\`\`\`

### 🔍 Let's break this down:

- \`if\` is a special word (keyword) that starts the statement
- The round brackets \`( )\` contain a question that has a true/false answer
- The curly brackets \`{ }\` contain the code that runs ONLY if the answer is true
- Every line of code inside ends with a semicolon \`;\`

### ✅ Understanding TRUE and FALSE:

Computers think in true/false (called **boolean** values):

- \`5 > 3\` is **TRUE** (5 is greater than 3)
- \`'red' === 'blue'\` is **FALSE** (red does not equal blue)
- \`i % 2 === 0\` is **TRUE** when \`i\` is an even number

### 🔧 Comparison Operators (how to ask questions):

- \`===\` means 'exactly equal to'
- \`!==\` means 'not equal to'
- \`>\` means 'greater than'
- \`<\` means 'less than'
- \`>=\` means 'greater than or equal to'
- \`<=\` means 'less than or equal to'

### 🌟 Adding ELSE:

You can also tell the computer what to do if the condition is **FALSE**:

\`\`\`javascript
if (condition) {
    // runs if TRUE
} else {
    // runs if FALSE
}
\`\`\`

### 💡 The % operator:

The \`%\` symbol finds the remainder after division:

- \`4 % 2 = 0\` (4 divided by 2 = 2 remainder 0)
- \`5 % 2 = 1\` (5 divided by 2 = 2 remainder 1)
- This helps us find even/odd numbers!

### 🎨 New Drawing Function:

- \`drawPixel(x, y, color)\` - Draws a single tiny dot at a specific position!

### 🌟 Your Challenge:

Look at the code below. Can you:

1. Change the colors?
2. Try different conditions?
3. Add more shapes?`,
    starterCode: `// Let's make the computer choose colors!
// This loop runs 10 times, with i going from 0 to 9
for (let i = 0; i < 10; i++) {
    // Calculate position for each shape
    let x = i * 40;  // Spread them across the canvas
    let y = 200;     // Keep them at the same height
    
    // Ask: "Is i an even number?"
    if (i % 2 === 0) {
        // If TRUE (even): draw a blue circle
        drawCircle(x, y, 20, 'blue');
    } else {
        // If FALSE (odd): draw a red square
        drawRect(x - 10, y - 10, 20, 20, 'red');
    }
    
    // Try changing this! What if you used:
    // if (i > 5) {
    //     drawCircle(x, y, 20, 'green');
    // } else {
    //     drawCircle(x, y, 20, 'purple');
    // }
}`,
    expectedOutput:
      "Alternating blue circles and red squares based on even/odd numbers",
    order: 6,
  },
  {
    id: 7,
    courseId: 1,
    title: "Listening to Keys",
    description: "Make your program respond to keyboard input",
    content: `## Listening to Keys

Learn to make your programs **interactive**! You can make things happen when keys are pressed.

### 🎮 New Functions:

- \`onKeyPress(callback)\` - Runs your code when **ANY** key is pressed
- \`onArrowKeys(callback)\` - Runs your code when **arrow keys** are pressed
- \`onSpaceBar(callback)\` - Runs your code when **spacebar** is pressed
- \`isKeyPressed(key)\` - Checks if a specific key is currently being held down

### How It Works:

\`\`\`javascript
onArrowKeys((direction) => {
    if (direction === 'up') {
        // do something when up arrow pressed
    }
});
\`\`\`

### 🌟 Your Challenge:

Try adding your own key controls! Can you make different shapes appear when different keys are pressed?`,
    starterCode: `// Let's make an interactive drawing!
let x = 200;
let y = 200;

// Clear the canvas first
clearCanvas();

// Draw our starting position
drawCircle(x, y, 10, 'blue');

// Listen for arrow keys
onArrowKeys((direction) => {
    // Move based on arrow key direction
    if (direction === 'up') y -= 10;
    if (direction === 'down') y += 10;
    if (direction === 'left') x -= 10;
    if (direction === 'right') x += 10;
    
    // Clear and redraw
    clearCanvas();
    drawCircle(x, y, 10, 'blue');
});

// Listen for spacebar to change color
onSpaceBar(() => {
    clearCanvas();
    drawCircle(x, y, 10, 'red');
});`,
    expectedOutput:
      "A blue circle that moves with arrow keys and turns red with spacebar",
    order: 7,
  },
  {
    id: 8,
    courseId: 1,
    title: "Colors and Shapes",
    description: "Learn about different colors and drawing shapes",
    content: `## Colors and Shapes

Let's explore different colors and learn to draw more shapes! Colors make our drawings come alive.

### 🎨 Color Tips:

- You can use **color names** like \`'red'\`, \`'blue'\`, \`'green'\`, \`'purple'\`, \`'orange'\`, \`'yellow'\`
- You can also use **hex codes** like \`'#FF0000'\` for red, \`'#00FF00'\` for green
- Try mixing different colors to make your art colorful!

### Common Color Names:

\`\`\`javascript
'red', 'blue', 'green', 'yellow', 'purple', 'orange', 
'pink', 'brown', 'black', 'white', 'gray', 'cyan'
\`\`\`

### 🌟 Your Challenge:

Draw a simple house using rectangles for the walls, lines for the roof, and a circle for the sun. Use at least 3 different colors!`,
    starterCode: `// Let's draw with different colors!
drawRect(150, 200, 100, 80, 'brown');  // House walls
drawRect(175, 240, 20, 40, 'darkbrown'); // Door
drawLine(150, 200, 200, 150, 'red');   // Roof left
drawLine(200, 150, 250, 200, 'red');   // Roof right
drawCircle(50, 50, 30, 'yellow');      // Sun

// Try adding more to your house!
// Maybe windows? A chimney? Flowers?`,
    expectedOutput: "A colorful house with sun",
    order: 8,
  },
  {
    id: 9,
    courseId: 1,
    title: "Making Patterns",
    description: "Use loops to create repeating patterns",
    content: `## Making Patterns

Loops help us repeat code without writing it over and over! It's like telling the computer **'do this 10 times'**.

### 🔄 About Loops:

- A \`for loop\` repeats code a certain number of times
- We use \`i\` as a **counter** that changes each time
- The loop runs while \`i\` is less than the number we set

### ✨ Loop Magic:

- \`i\` starts at \`0\`, then becomes \`1, 2, 3\`, and so on
- We can use \`i\` in our drawing to make patterns
- \`i * 50\` means: \`0, 50, 100, 150...\` (perfect for spacing!)

### Pattern Example:

\`\`\`javascript
for (let i = 0; i < 5; i++) {
    drawCircle(50 + i * 60, 200, 20, 'purple');
}
\`\`\`

### 🌟 Your Challenge:

Create your own pattern! Try changing the numbers, colors, or shapes. What happens if you use \`i\` for the color or size?`,
    starterCode: `// Let's make a pattern with a loop!
for (let i = 0; i < 5; i++) {
  // Can you see why the circles are spaced out?
  drawCircle(50 + i * 60, 200, 20, 'purple');
}

// Try making a different pattern!
for (let i = 0; i < 3; i++) {
  // Can you see why the squares start further right
  // than the circles?
  drawRect(100 + i * 80, 300, 40, 40, 'orange');
}`,
    expectedOutput: "A pattern of purple circles and orange squares",
    order: 9,
  },
  {
    id: 10,
    courseId: 1,
    title: "Random Fun",
    description: "Add randomness to make things unpredictable",
    content: `## Random Fun

Random numbers make our programs exciting and **different every time**! It's like rolling dice in your code.

### 🎲 Random Magic:

- \`Math.random()\` gives us a number between \`0\` and \`1\`
- \`Math.random() * 400\` gives us a number between \`0\` and \`400\`
- \`Math.floor()\` removes the decimal part (\`1.7\` becomes \`1\`)
- This helps us get random positions on our canvas!

### Random Examples:

\`\`\`javascript
let randomX = Math.floor(Math.random() * 400);  // 0 to 399
let randomY = Math.floor(Math.random() * 300);  // 0 to 299
drawCircle(randomX, randomY, 20, 'blue');
\`\`\`

### 🌈 Random Ideas:

- Random positions for stars in the sky
- Random colors for a rainbow
- Random sizes for bubbles

### 🌟 Your Challenge:

Run your code multiple times and watch it change! Try adding more random elements - maybe random colors or sizes!`,
    starterCode: `// Let's add some randomness!
clearCanvas();

// Draw 10 random circles
for (let i = 0; i < 10; i++) {
  let x = Math.floor(Math.random() * 400);
  let y = Math.floor(Math.random() * 400);
  let colors = ['red', 'blue', 'green', 'purple', 'orange'];
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  drawCircle(x, y, 15, randomColor);
}

// Try adding random rectangles too!`,
    expectedOutput: "Random colored circles scattered around",
    order: 10,
  },
  {
    id: 11,
    courseId: 1,
    title: "Moving Things",
    description: "Learn to animate objects",
    content: `## Simple Animation

Animation makes things **move on screen**! We use \`setInterval\` to run code over and over, creating motion.

### ⏰ About setInterval:

- \`setInterval(function, milliseconds)\` runs code repeatedly
- \`100\` milliseconds = \`0.1\` seconds (pretty fast!)
- We change positions each time to create movement
- \`clearCanvas()\` erases the old drawing before drawing the new one

### Basic Animation:

\`\`\`javascript
setInterval(() => {
    clearCanvas();              // Clear old drawing
    drawCircle(ballX, ballY, 20, 'red');  // Draw new position
    ballX += 2;                // Move ball right
}, 100);
\`\`\`

### 🏃‍♀️ Movement Tips:

- Increase \`x\` to move right, decrease to move left
- Increase \`y\` to move down, decrease to move up
- Check boundaries to keep things on screen

### 🌟 Your Challenge:

Try changing the speed (\`100\` to \`50\` for faster, \`200\` for slower) or direction. Can you make the ball bounce off the edges?`,
    starterCode: `// Let's make a moving ball!
let ballX = 50;
let ballY = 200;
let speedX = 2;

setInterval(() => {
  clearCanvas();
  drawCircle(ballX, ballY, 20, 'red');
  ballX = ballX + speedX;
  
  // Bounce off edges
  if (ballX > 380 || ballX < 20) {
    speedX = -speedX;
  }
}, 100);`,
    expectedOutput: "A red ball bouncing back and forth",
    order: 11,
  },
  {
    id: 12,
    courseId: 1,
    title: "Spacebar Magic",
    description: "Add special actions with the spacebar",
    content: `## Spacebar Magic

The **spacebar** is perfect for special actions! In games, it's often used for jumping, shooting, or resetting things.

### 🚀 Spacebar Power:

- \`onSpaceBar()\` listens specifically for the spacebar
- Great for **'action'** buttons in games
- Can trigger special effects or reset your game
- Works great with other keyboard controls

### How to Use:

\`\`\`javascript
onSpaceBar(() => {
    // This runs when spacebar is pressed
    drawCircle(playerX, playerY, 30, 'gold');
});
\`\`\`

### ✨ Action Ideas:

- Jump or change color
- Create new objects
- Reset positions
- Trigger animations

### 🌟 Your Challenge:

Try combining arrow keys **AND** spacebar! Maybe the spacebar changes the player's color, or creates a trail behind them?`,
    starterCode: `// Spacebar creates colorful circles!
let playerX = 200;
let playerY = 200;
let circles = [];

// Move with arrow keys
onArrowKeys((direction, preventDefault) => {
  preventDefault();
  
  if (direction === 'left') playerX -= 15;
  if (direction === 'right') playerX += 15;
  if (direction === 'up') playerY -= 15;
  if (direction === 'down') playerY += 15;
  
  redrawEverything();
});

// Spacebar creates a circle!
onSpaceBar(() => {
  let colors = ['red', 'blue', 'green', 'purple', 'orange'];
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  circles.push({x: playerX, y: playerY, color: randomColor});
  redrawEverything();
});

function redrawEverything() {
  clearCanvas();
  
  // Draw all circles
  for (let circle of circles) {
    drawCircle(circle.x, circle.y, 10, circle.color);
  }
  
  // Draw player
  drawRect(playerX, playerY, 20, 20, 'black');
}

// Initial draw
redrawEverything();`,
    expectedOutput:
      "Move with arrows, press spacebar to create colorful circles",
    order: 12,
  },
  {
    id: 13,
    courseId: 1,
    title: "Snake Game",
    description: "Build the classic Snake game",
    content: `## Snake Game

Let's build the famous **Snake game**! This combines everything we've learned: drawing, movement, keyboard controls, and game logic.

### 🐍 Snake Game Rules:

- Snake moves continuously in one direction
- Arrow keys change the direction
- Snake grows when it eats food
- Game ends if snake hits the walls or itself
- Score increases with each food eaten

### 🎮 Game Programming Concepts:

- **Game loop** (\`setInterval\`) keeps everything moving
- **Arrays** store the snake's body segments
- **Collision detection** checks for hits
- **Game state** manages score and game over

### Core Game Structure:

\`\`\`javascript
let snake = [{x: 200, y: 200}];  // Snake body
let direction = 'right';         // Current direction
let food = {x: 160, y: 160};     // Food position
let gameOver = false;            // Game state
\`\`\`

### 🌟 Your Challenge:

Try making the game your own! Change colors, speed, or add new features. What about power-ups or obstacles?`,
    starterCode: `// Snake Game!
let snake = [{x: 200, y: 200}];
let direction = 'right';
let food = {x: 160, y: 160};  // Fixed: align to 20px grid
let gameOver = false;

// Game loop
setInterval(() => {
    if (gameOver) return;
    
    // Move snake
    let head = {...snake[0]};
    if (direction === 'up') head.y -= 20;
    if (direction === 'down') head.y += 20;
    if (direction === 'left') head.x -= 20;
    if (direction === 'right') head.x += 20;
    
    // Check walls
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
        gameOver = true;
        return;
    }
    
    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver = true;
            return;
        }
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        // Generate new food position (aligned to 20px grid)
        food = {
            x: Math.floor(Math.random() * 19) * 20,  // 0-18 * 20 = 0-360
            y: Math.floor(Math.random() * 19) * 20   // 0-18 * 20 = 0-360
        };
    } else {
        snake.pop();
    }
    
    // Draw everything
    clearCanvas();
    
    // Draw snake
    for (let segment of snake) {
        drawRect(segment.x, segment.y, 20, 20, 'green');
    }
    
    // Draw food
    drawRect(food.x, food.y, 20, 20, 'red');
    
    if (gameOver) {
        drawText(150, 200, 'Game Over!', 'black');
        drawText(120, 230, 'Press Space to Restart', 'black');
    }
}, 200);

// Controls
onArrowKeys((dir) => {
    if (dir === 'up' && direction !== 'down') direction = 'up';
    if (dir === 'down' && direction !== 'up') direction = 'down';
    if (dir === 'left' && direction !== 'right') direction = 'left';
    if (dir === 'right' && direction !== 'left') direction = 'right';
});

onSpaceBar(() => {
    if (gameOver) {
        snake = [{x: 200, y: 200}];
        direction = 'right';
        food = {x: 160, y: 160};  // Fixed: align to 20px grid
        gameOver = false;
    }
});`,
    expectedOutput: "A playable Snake game with arrow key controls",
    order: 13,
  },
  {
    id: 14,
    courseId: 1,
    title: "Your Own Game!",
    description: "Create your own game using everything you've learned",
    content: `## Your Own Game!

**Congratulations!** You've learned all the basics of programming and game development. Now it's time to create something totally your own!

### 🎯 What You Can Build:

- A different type of game (Pong, Pac-Man style, platformer)
- An interactive art program
- A physics simulation
- A drawing tool with special effects
- Your own twist on Snake

### 🛠️ Tools You've Mastered:

- **Drawing** shapes and colors
- **Variables** and maths
- **Loops** and patterns
- **Random numbers**
- **Animation** with \`setInterval\`
- **Keyboard controls**
- **Game logic** and collision detection

### Programming Concepts You Know:

\`\`\`javascript
// Variables and Math
let score = 0;
score += 10;

// Loops and Patterns
for (let i = 0; i < 5; i++) {
    drawCircle(i * 50, 200, 20, 'blue');
}

// Conditions and Logic
if (player.x > enemy.x) {
    // Player is to the right
}

// Animation and Interaction
setInterval(() => {
    // Game loop
}, 100);
\`\`\`

### 🌟 Your Challenge:

Start with a blank canvas and create something **amazing**! Don't be afraid to experiment, break things, and try new ideas. Programming is all about creativity and problem-solving!`,
    starterCode: `// Your blank canvas - create anything you want!
// Here are some ideas to get you started:

// Idea 1: Paint program
// onKeyPress((key) => {
//   // Draw wherever mouse would be
// });

// Idea 2: Bouncing balls
// let balls = [];
// setInterval(() => {
//   // Move and bounce balls
// }, 50);

// Idea 3: Space shooter
// let player = {x: 200, y: 350};
// let bullets = [];
// let enemies = [];

// Start coding your masterpiece here!
clearCanvas();
drawText(150, 200, 'Your turn to create!', 'purple');`,
    expectedOutput: "Your own creative project",
    order: 14,
  },

  // Array Methods Course (courseId: 2)
  {
    id: 16,
    courseId: 2,
    title: "forEach - Do Something with Each Item",
    description: "Loop through arrays the easy way",
    content: `## forEach - Do Something with Each Item

\`forEach\` is like a **magic loop** that goes through each item in your array automatically!

### 🔍 What You'll Learn:

- How \`forEach\` works
- How to access each item and its position
- Why \`forEach\` is better than regular \`for\` loops for arrays

### Basic forEach Syntax:

\`\`\`javascript
array.forEach((item, index) => {
    // Do something with each item
    console.log(item);
});
\`\`\`

### How It Works:

- **First parameter** (\`item\`) is the current array element
- **Second parameter** (\`index\`) is the position (0, 1, 2...)
- Automatically loops through **every** item
- Much cleaner than traditional \`for\` loops!

### 🌟 Your Challenge:

Try using \`forEach\` with your own array. Maybe an array of your favorite colors or numbers!`,
    starterCode: `// Let's use forEach to go through an array!
let numbers = [2, 4, 6, 8, 10];

printData('Original array:');
printData(numbers);

printData('Each number doubled:');
numbers.forEach((number, index) => {
    let doubled = number * 2;
    printData(\`Position \$\{index}: \$\{number} doubled is \$\{doubled}\`);
});

// Let's try with names
let names = ['Alice', 'Bob', 'Charlie'];
printData('Greeting each person:');
names.forEach((name) => {
    printData(\`Hello, \$\{name}!\`);
});`,
    expectedOutput: "Each array item processed and displayed",
    order: 1,
  },
  {
    id: 17,
    courseId: 2,
    title: "map - Transform Each Item",
    description: "Create a new array by changing each item",
    content: `## map - Transform Each Item

\`map\` is like a **factory** that takes each item in your array, transforms it, and creates a **new array** with the results!

### 🔍 What You'll Learn:

- How \`map\` transforms arrays
- The difference between \`map\` and \`forEach\`
- How to create new arrays from existing ones

### Basic map Syntax:

\`\`\`javascript
let newArray = oldArray.map(item => {
    // Transform the item
    return item * 2;
});
\`\`\`

### Key Differences:

- **\`forEach\`**: Loops through items, doesn't return anything
- **\`map\`**: Transforms items and **returns a new array**
- **Original array**: Never changed by \`map\`

### Example:

\`\`\`javascript
let numbers = [1, 2, 3];
let doubled = numbers.map(n => n * 2);  // [2, 4, 6]
// numbers is still [1, 2, 3]
\`\`\`

### 🌟 Your Challenge:

Try mapping numbers to their squares, or words to their lengths!`,
    starterCode: `// Let's transform an array with map!
let numbers = [1, 2, 3, 4, 5];

printData('Original numbers:');
printData(numbers);

// Create a new array with each number squared
let squared = numbers.map(number => number * number);
printData('Squared numbers:');
printData(squared);

// Let's try with words
let words = ['cat', 'dog', 'elephant', 'ant'];
printData('Original words:');
printData(words);

// Create a new array with word lengths
let lengths = words.map(word => word.length);
printData('Word lengths:');
printData(lengths);

// Make them all uppercase
let uppercase = words.map(word => word.toUpperCase());
printData('Uppercase words:');
printData(uppercase);`,
    expectedOutput: "Original and transformed arrays displayed",
    order: 2,
  },
  {
    id: 18,
    courseId: 2,
    title: "filter - Keep Only Some Items",
    description: "Create a new array with only the items you want",
    content: `## filter - Keep Only Some Items

\`filter\` is like a **gatekeeper** that only lets certain items through to create a new array!

### 🔍 What You'll Learn:

- How \`filter\` selects items
- How to write conditions for filtering
- Creating subsets of your data

### Basic filter Syntax:

\`\`\`javascript
let filtered = array.filter(item => {
    // Return true to keep, false to remove
    return item > 5;
});
\`\`\`

### How It Works:

- \`filter\` tests each item with your condition
- If condition returns \`true\`, item is **kept**
- If condition returns \`false\`, item is **removed**
- Returns a **new array** with only the items that passed

### Common Filter Examples:

\`\`\`javascript
// Keep even numbers
numbers.filter(n => n % 2 === 0);

// Keep long words
words.filter(word => word.length > 5);

// Keep positive numbers
numbers.filter(n => n > 0);
\`\`\`

### 🌟 Your Challenge:

Try filtering for your favorite items, or numbers that meet certain conditions!`,
    starterCode: `// Let's filter an array!
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

printData('All numbers:');
printData(numbers);

// Keep only even numbers
let evenNumbers = numbers.filter(number => number % 2 === 0);
printData('Even numbers only:');
printData(evenNumbers);

// Keep only numbers greater than 5
let bigNumbers = numbers.filter(number => number > 5);
printData('Numbers greater than 5:');
printData(bigNumbers);

// Let's try with words
let animals = ['cat', 'dog', 'elephant', 'ant', 'bear'];
printData('All animals:');
printData(animals);

// Keep only animals with more than 3 letters
let longNames = animals.filter(animal => animal.length > 3);
printData('Animals with long names:');
printData(longNames);`,
    expectedOutput: "Original array and filtered results displayed",
    order: 3,
  },
  {
    id: 19,
    courseId: 2,
    title: "reduce - Combine All Items",
    description: "Combine all array items into a single value",
    content: `## reduce - Combine All Items

\`reduce\` is like a **blender** that combines all your array items into one result!

### 🔍 What You'll Learn:

- How \`reduce\` combines items
- How to use an **accumulator**
- Common \`reduce\` patterns

### Basic reduce Syntax:

\`\`\`javascript
let result = array.reduce((accumulator, item) => {
    // Combine accumulator with current item
    return accumulator + item;
}, startingValue);
\`\`\`

### How It Works:

- **Accumulator**: The running total/result so far
- **Item**: Current array element being processed
- **Starting value**: What to begin with (often \`0\` or \`''\`)
- Returns: Single combined value

### Common reduce Examples:

\`\`\`javascript
// Sum all numbers
numbers.reduce((sum, n) => sum + n, 0);

// Find maximum
numbers.reduce((max, n) => n > max ? n : max);

// Join words
words.reduce((sentence, word) => sentence + ' ' + word, '');
\`\`\`

### 🌟 Your Challenge:

Try using \`reduce\` to find the longest word, or to count how many times each item appears!`,
    starterCode: `// Let's use reduce to combine things!
let numbers = [1, 2, 3, 4, 5];

printData('Numbers to add:');
printData(numbers);

// Add all numbers together
let sum = numbers.reduce((total, number) => total + number, 0);
printData('Sum of all numbers:');
printData(sum);

// Find the largest number
let largest = numbers.reduce((biggest, number) => {
    return number > biggest ? number : biggest;
}, numbers[0]);
printData('Largest number:');
printData(largest);

// Let's try with words
let words = ['Hello', 'world', 'this', 'is', 'awesome'];
printData('Words to combine:');
printData(words);

// Combine all words into one sentence
let sentence = words.reduce((text, word) => text + ' ' + word, '');
printData('Combined sentence:');
printData(sentence);`,
    expectedOutput: "Various combinations and calculations displayed",
    order: 4,
  },

  // DOM Manipulation Course (courseId: 3)
  {
    id: 20,
    courseId: 3,
    title: "What is HTML?",
    description: "Learn the basics of HTML structure and the DOM",
    content: `## What is HTML?

HTML is the **language that creates web pages**! Think of it like building blocks that tell the browser how to display content.

### 🏗️ HTML Structure:

- HTML pages have a \`<head>\` (invisible info) and \`<body>\` (visible content)
- **Tags** are like containers: \`<h1>Title</h1>\` wraps text to make it a heading
- **Attributes** give extra info to tags: \`<h1 id="title">Hello</h1>\`
- The browser creates a **'document'** object you can control with JavaScript

### Basic HTML Structure:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    <h1>My Heading</h1>
    <p>My paragraph</p>
</body>
</html>
\`\`\`

### Common HTML Tags:

- \`<h1>\`, \`<h2>\`, \`<h3>\` - Headings
- \`<p>\` - Paragraphs
- \`<div>\` - Containers
- \`<button>\` - Clickable buttons

### 🌟 Your Challenge:

Try changing the text, adding your own paragraph, or modifying the styles!`,
    starterCode: `<!DOCTYPE html>
<html>
<head>
    <title>My First Webpage</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f0f0f0;
        }
        .highlight {
            background-color: yellow;
            padding: 5px;
        }
    </style>
</head>
<body>
    <h1 id="main-title">Welcome to HTML!</h1>
    <p class="intro">This is a paragraph inside the body.</p>
    <p>HTML uses <strong>tags</strong> to structure content.</p>
    <button onclick="changeTitle()">Click me!</button>
    <div id="output"></div>

    <script>
        // The 'document' object represents the entire HTML page
        console.log('The document object:', document);
        
        // The 'window' object represents the browser window
        console.log('The window object:', window);
        
        // You can find elements by their id attribute
        let titleElement = document.getElementById('main-title');
        console.log('Found title element:', titleElement);
        
        function changeTitle() {
            // Find the title element each time to make sure we have it
            let titleElement = document.getElementById('main-title');

            // Change the text inside the title
            titleElement.textContent = 'I changed the title with JavaScript!';
            
            // Add some content to the output div
            let output = document.getElementById('output');
            output.innerHTML = '<p class="highlight">JavaScript can change HTML!</p>';
            
            console.log('Title changed!');
        }
    </script>
</body>
</html>`,
    expectedOutput:
      "A webpage explaining HTML basics with interactive elements",
    order: 1,
  },
  {
    id: 21,
    courseId: 3,
    title: "Finding Elements",
    description: "Learn to find and select HTML elements",
    content: `## Finding Elements

The **DOM** (Document Object Model) is like a map of your webpage. You can find any element and change it!

### 🔍 What You'll Learn:

- How to find elements by ID, class, and tag
- The difference between \`querySelector\` and \`querySelectorAll\`
- How to check if elements exist

### Finding Elements:

\`\`\`javascript
// By ID
document.getElementById('myId');

// By class (first match)
document.querySelector('.myClass');

// By tag (all matches)
document.querySelectorAll('p');
\`\`\`

### 🌟 Your Challenge:

Try finding different elements and changing their text!`,
    starterCode: `<!DOCTYPE html>
<html>
<head>
    <title>Finding Elements</title>
</head>
<body>
    <h1 id="title">Welcome to DOM Manipulation!</h1>
    <p class="text">This is a paragraph.</p>
    <p class="text">This is another paragraph.</p>
    <button id="myButton">Click me!</button>
    <div id="output"></div>

    <script>
        // Find element by ID
        let title = document.getElementById('title');
        console.log('Found title:', title.textContent);

        // Find element by class (gets the first one)
        let firstParagraph = document.querySelector('.text');
        console.log('First paragraph:', firstParagraph.textContent);

        // Find all elements by class
        let allParagraphs = document.querySelectorAll('.text');
        console.log('Number of paragraphs:', allParagraphs.length);

        // Change some text
        title.textContent = 'I changed the title!';
        firstParagraph.textContent = 'I changed this paragraph!';

        // Change the output div
        let output = document.getElementById('output');
        output.innerHTML = '<p>I added this with JavaScript!</p>';
    </script>
</body>
</html>`,
    expectedOutput: "A webpage with modified elements",
    order: 2,
  },
  {
    id: 22,
    courseId: 3,
    title: "Changing Styles",
    description: "Make your webpage look different with JavaScript",
    content: `## Changing Styles

You can change how elements look using **JavaScript**! Change colors, sizes, positions, and more.

### 🔍 What You'll Learn:

- How to change CSS properties with JavaScript
- How to add and remove CSS classes
- How to create visual effects

### Changing Styles:

\`\`\`javascript
// Change CSS properties directly
element.style.color = 'red';
element.style.fontSize = '20px';

// Add/remove CSS classes
element.classList.add('highlight');
element.classList.remove('old-style');
\`\`\`

### 🌟 Your Challenge:

Try changing different style properties and see what happens!`,
    starterCode: `<!DOCTYPE html>
<html>
<head>
    <title>Changing Styles</title>
    <style>
        .highlight { background-color: yellow; }
        .big-text { font-size: 24px; }
        .colorful { color: rainbow; }
    </style>
</head>
<body>
    <h1 id="title">Style Me!</h1>
    <p id="text">This text will change styles.</p>
    <button id="colorBtn">Change Colors</button>
    <button id="sizeBtn">Change Size</button>
    <div id="box" style="width: 100px; height: 100px; background: blue;"></div>

    <script>
        let title = document.getElementById('title');
        let text = document.getElementById('text');
        let box = document.getElementById('box');

        // Change styles directly
        title.style.color = 'red';
        title.style.fontSize = '36px';

        // Add a CSS class
        text.classList.add('highlight');

        // Button to change colors
        document.getElementById('colorBtn').addEventListener('click', () => {
            box.style.backgroundColor = 'green';
            title.style.color = 'purple';
        });

        // Button to change size
        document.getElementById('sizeBtn').addEventListener('click', () => {
            text.classList.add('big-text');
            box.style.width = '200px';
            box.style.height = '200px';
        });

        // Make the box move
        let position = 0;
        setInterval(() => {
            position += 1;
            box.style.marginLeft = position + 'px';
            if (position > 100) position = 0;
        }, 50);
    </script>
</body>
</html>`,
    expectedOutput: "A webpage with changing colors, sizes, and animations",
    order: 3,
  },
  {
    id: 23,
    courseId: 3,
    title: "Creating New Elements",
    description: "Add new HTML elements with JavaScript",
    content: `## Creating New Elements

You can create **brand new HTML elements** and add them to your page!

### 🔍 What You'll Learn:

- How to create new elements
- How to add them to the page
- How to remove elements

### Creating Elements:

\`\`\`javascript
// Create a new element
let newDiv = document.createElement('div');
newDiv.textContent = 'Hello World!';

// Add to page
document.body.appendChild(newDiv);

// Remove from page
newDiv.remove();
\`\`\`

### 🌟 Your Challenge:

Try creating different types of elements and adding them in different places!`,
    starterCode: `<!DOCTYPE html>
<html>
<head>
    <title>Creating Elements</title>
</head>
<body>
    <h1>Element Creator</h1>
    <button id="addBtn">Add Paragraph</button>
    <button id="addListBtn">Add List Item</button>
    <button id="clearBtn">Clear All</button>
    <div id="container"></div>
    <ul id="list"></ul>

    <script>
        let container = document.getElementById('container');
        let list = document.getElementById('list');
        let counter = 1;

        // Add paragraph button
        document.getElementById('addBtn').addEventListener('click', () => {
            // Create new paragraph element
            let newParagraph = document.createElement('p');
            newParagraph.textContent = \`This is paragraph number \$\{counter\}\`;
            newParagraph.style.color = 'blue';
            
            // Add it to the container
            container.appendChild(newParagraph);
            counter++;
        });

        // Add list item button
        document.getElementById('addListBtn').addEventListener('click', () => {
            let newListItem = document.createElement('li');
            newListItem.textContent = \`List item \$\{counter\}\`;
            list.appendChild(newListItem);
            counter++;
        });

        // Clear all button
        document.getElementById('clearBtn').addEventListener('click', () => {
            container.innerHTML = '';
            list.innerHTML = '';
            counter = 1;
        });

        // Create some elements automatically
        for (let i = 1; i <= 3; i++) {
            let div = document.createElement('div');
            div.textContent = \`Auto-created div \$\{i\}\`;
            div.style.backgroundColor = 'lightblue';
            div.style.margin = '5px';
            div.style.padding = '10px';
            container.appendChild(div);
        }
    </script>
</body>
</html>`,
    expectedOutput: "A webpage where you can create and remove elements",
    order: 4,
  },
  {
    id: 24,
    courseId: 3,
    title: "Working with Forms",
    description: "Get input from users with forms",
    content: `## Working with Forms

**Forms** let users type information and interact with your webpage!

### 🔍 What You'll Learn:

- How to get values from input fields
- How to respond to form submissions
- How to validate user input

### Form Basics:

\`\`\`javascript
// Get input value
let inputValue = document.getElementById('myInput').value;

// Listen for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop page reload
    // Handle form data
});
\`\`\`

### 🌟 Your Challenge:

Try adding more form fields and creating a more complex form!`,
    starterCode: `<!DOCTYPE html>
<html>
<head>
    <title>Working with Forms</title>
</head>
<body>
    <h1>User Information Form</h1>
    
    <form id="userForm">
        <label for="name">Name:</label>
        <input type="text" id="name" required>
        <br><br>
        
        <label for="age">Age:</label>
        <input type="number" id="age" min="1" max="120">
        <br><br>
        
        <label for="color">Favorite Color:</label>
        <select id="color">
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
        </select>
        <br><br>
        
        <button type="submit">Submit</button>
    </form>
    
    <div id="result"></div>

    <script>
        let form = document.getElementById('userForm');
        let result = document.getElementById('result');

        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Don't reload the page
            
            // Get values from form
            let name = document.getElementById('name').value;
            let age = document.getElementById('age').value;
            let color = document.getElementById('color').value;
            
            // Validate input
            if (!name) {
                alert('Please enter your name!');
                return;
            }
            
            if (!age || age < 1) {
                alert('Please enter a valid age!');
                return;
            }
            
            // Display result
            result.innerHTML = \`
                <h2>Hello, \${name}!</h2>
                <p>You are \${age} years old.</p>
                <p>Your favorite color is <span style="color: \${color};">\${color}</span>.</p>
            \`;
            
            // Change page background to their favorite color
            document.body.style.backgroundColor = color;
            
            // Clear form
            form.reset();
        });

        // Live preview as they type
        document.getElementById('name').addEventListener('input', (event) => {
            let preview = document.getElementById('preview');
            if (!preview) {
                preview = document.createElement('p');
                preview.id = 'preview';
                preview.style.fontStyle = 'italic';
                form.appendChild(preview);
            }
            preview.textContent = event.target.value ? \`Hello, \$\{event.target.value\}!\` : '';
        });
    </script>
</body>
</html>`,
    expectedOutput:
      "A working form that collects and displays user information",
    order: 5,
  },

  // Algorithms Course (courseId: 4)
  {
    id: 24,
    courseId: 4,
    title: "What Are Algorithms?",
    description: "Learn what algorithms are and why they're important",
    content: `## What Are Algorithms?

An **algorithm** is like a recipe - it's a set of steps to solve a problem!

### 🔍 What You'll Learn:

- What algorithms are
- How to break down problems into steps
- Why algorithms are everywhere

### Algorithm Examples:

\`\`\`javascript
// Algorithm to find largest number
function findLargest(numbers) {
    let largest = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > largest) {
            largest = numbers[i];
        }
    }
    return largest;
}
\`\`\`

### 🌟 Your Challenge:

Try creating your own algorithm to solve a simple problem!`,
    starterCode: `// Let's create a simple algorithm!

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
printData('Numbers to search:');
printData(testNumbers);

let result = findLargest(testNumbers);
printData('Largest number found:');
printData(result);

// Algorithm: Check if a word is a palindrome
function isPalindrome(word) {
    let reversed = word.split('').reverse().join('');
    return word.toLowerCase() === reversed.toLowerCase();
}

// Test palindrome algorithm
let testWords = ['racecar', 'hello', 'madam', 'javascript'];
printData('Testing palindromes:');
testWords.forEach(word => {
    let result = isPalindrome(word);
    printData(\`"\${word}" is \$\{result ? 'a palindrome' : 'not a palindrome'\}\`);
});`,
    expectedOutput:
      "Algorithm results for finding largest number and checking palindromes",
    order: 1,
  },
  {
    id: 25,
    courseId: 4,
    title: "Searching Algorithms",
    description: "Learn different ways to find things in lists",
    content: `## Searching Algorithms

There are many ways to **search for items** in a list. Let's explore the most common ones!

### 🔍 What You'll Learn:

- **Linear search** (checking each item one by one)
- **Binary search** (for sorted lists)
- When to use each method

### Search Types:

\`\`\`javascript
// Linear Search - check each item
function linearSearch(array, target) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === target) return i;
    }
    return -1; // Not found
}

// Binary Search - for sorted arrays
function binarySearch(array, target) {
    let left = 0, right = array.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (array[mid] === target) return mid;
        if (array[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
\`\`\`

### 🌟 Your Challenge:

Try searching for different items and see how many steps each algorithm takes!`,
    starterCode: `// Linear Search - Check each item one by one
function linearSearch(array, target) {
    let steps = 0;
    for (let i = 0; i < array.length; i++) {
        steps++;
        if (array[i] === target) {
            return { found: true, index: i, steps: steps };
        }
    }
    return { found: false, index: -1, steps: steps };
}

// Binary Search - For sorted arrays only!
function binarySearch(array, target) {
    let left = 0;
    let right = array.length - 1;
    let steps = 0;
    
    while (left <= right) {
        steps++;
        let middle = Math.floor((left + right) / 2);
        
        if (array[middle] === target) {
            return { found: true, index: middle, steps: steps };
        } else if (array[middle] < target) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }
    
    return { found: false, index: -1, steps: steps };
}

// Test both algorithms
let numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
let target = 13;

printData('Searching for:', target);
printData('In array:', numbers);

let linearResult = linearSearch(numbers, target);
printData('Linear search result:');
printData(linearResult);

let binaryResult = binarySearch(numbers, target);
printData('Binary search result:');
printData(binaryResult);

printData(\`Binary search was \$\{linearResult.steps - binaryResult.steps\} steps faster!\`);`,
    expectedOutput: "Comparison of linear and binary search algorithms",
    order: 2,
  },
  {
    id: 26,
    courseId: 4,
    title: "Sorting Algorithms",
    description: "Learn how to put things in order",
    content: `## Sorting Algorithms

**Sorting** is putting things in order - like organizing your toys by size or alphabetically!

### 🔍 What You'll Learn:

- **Bubble sort** (compare neighbors)
- **Selection sort** (find the smallest)
- How different sorting methods work

### Sorting Examples:

\`\`\`javascript
// Bubble Sort
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
\`\`\`

### 🌟 Your Challenge:

Try sorting different types of data - numbers, words, or even custom objects!`,
    starterCode: `// Bubble Sort - Compare neighbors and swap if needed
function bubbleSort(array) {
    let arr = [...array]; // Make a copy
    let steps = 0;
    
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            steps++;
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    
    return { sorted: arr, steps: steps };
}

// Selection Sort - Find the smallest and put it first
function selectionSort(array) {
    let arr = [...array]; // Make a copy
    let steps = 0;
    
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        
        for (let j = i + 1; j < arr.length; j++) {
            steps++;
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap if needed
        if (minIndex !== i) {
            let temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
    
    return { sorted: arr, steps: steps };
}

// Test both sorting algorithms
let unsortedNumbers = [64, 34, 25, 12, 22, 11, 90];
printData('Original array:');
printData(unsortedNumbers);

let bubbleResult = bubbleSort(unsortedNumbers);
printData('Bubble sort result:');
printData(bubbleResult);

let selectionResult = selectionSort(unsortedNumbers);
printData('Selection sort result:');
printData(selectionResult);

// Sort words alphabetically
let words = ['banana', 'apple', 'cherry', 'date'];
printData('Sorting words:');
printData(words);
printData('Sorted words:');
printData(bubbleSort(words).sorted);`,
    expectedOutput: "Comparison of bubble sort and selection sort algorithms",
    order: 3,
  },
  {
    id: 27,
    courseId: 4,
    title: "Introduction to Recursion",
    description: "Learn how functions can call themselves",
    content: `## Introduction to Recursion

**Recursion** is when a function calls itself! It's like looking in a mirror that reflects another mirror.

### 🔍 What You'll Learn:

- What recursion is
- How to write recursive functions
- When recursion is useful

### Recursion Basics:

\`\`\`javascript
// Recursive function needs:
// 1. Base case (when to stop)
// 2. Recursive case (calling itself)

function factorial(n) {
    // Base case
    if (n <= 1) return 1;
    
    // Recursive case
    return n * factorial(n - 1);
}
\`\`\`

### 🌟 Your Challenge:

Try writing your own recursive function to solve a problem!`,
    starterCode: `// Recursive function to calculate factorial
// 5! = 5 × 4 × 3 × 2 × 1 = 120
function factorial(n) {
    printData(\`Calculating factorial of \$\{n\}\`);
    
    // Base case - when to stop
    if (n === 0 || n === 1) {
        printData(\`Base case: \$\{n\}! = 1\`);
        return 1;
    }
    
    // Recursive case - function calls itself
    let result = n * factorial(n - 1);
    printData(\`\$\{n\}! = \$\{n\} × \$\{n-1\}! = \$\{result\}\`);
    return result;
}

// Test factorial
printData('Computing 5!:');
let fact5 = factorial(5);
printData('Final result:', fact5);

printData('---');

// Recursive function to sum numbers from 1 to n
function sumUpTo(n) {
    if (n === 1) {
        printData('Base case: sum up to 1 = 1');
        return 1;
    }
    
    let result = n + sumUpTo(n - 1);
    printData(\`Sum up to \$\{n\} = \$\{n\} + sum up to \$\{n-1\} = \$\{result\}\`);
    return result;
}

printData('Computing sum from 1 to 5:');
let sum = sumUpTo(5);
printData('Final sum:', sum);

printData('---');

// Fibonacci sequence using recursion
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

printData('First 10 Fibonacci numbers:');
for (let i = 0; i < 10; i++) {
    printData(\`F(\$\{i\}) = \$\{fibonacci(i)\}\`);
}`,
    expectedOutput:
      "Step-by-step recursive calculations for factorial, sum, and Fibonacci",
    order: 4,
  },
  {
    id: 28,
    courseId: 4,
    title: "Problem Solving Strategies",
    description: "Learn how to approach complex problems",
    content: `## Problem Solving Strategies

**Breaking down big problems** into smaller ones is the key to solving anything!

### 🔍 What You'll Learn:

- **Divide and conquer** approach
- How to identify patterns
- Step-by-step problem solving

### Problem Solving Steps:

1. **Understand** the problem
2. **Break it down** into smaller parts
3. **Solve** each part individually
4. **Combine** solutions together
5. **Test** and refine

### Example Strategy:

\`\`\`javascript
// Complex problem: Sort and remove duplicates
function sortAndRemoveDuplicates(arr) {
    // Step 1: Remove duplicates
    let unique = [...new Set(arr)];
    
    // Step 2: Sort the array
    return unique.sort((a, b) => a - b);
}
\`\`\`

### 🌟 Your Challenge:

Try solving a complex problem by breaking it down into smaller parts!`,
    starterCode: `// Problem: Find all anagrams of a word
// An anagram is a word made by rearranging letters of another word

// Step 1: Generate all permutations of a word
function getPermutations(str) {
    if (str.length <= 1) {
        return [str];
    }
    
    let permutations = [];
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        let remainingChars = str.slice(0, i) + str.slice(i + 1);
        let remainingPermutations = getPermutations(remainingChars);
        
        for (let perm of remainingPermutations) {
            permutations.push(char + perm);
        }
    }
    
    return permutations;
}

// Step 2: Check if permutations are real words
function findAnagrams(word, dictionary) {
    let permutations = getPermutations(word.toLowerCase());
    let anagrams = [];
    
    for (let perm of permutations) {
        if (dictionary.includes(perm) && perm !== word.toLowerCase()) {
            anagrams.push(perm);
        }
    }
    
    return [...new Set(anagrams)]; // Remove duplicates
}

// Test our anagram finder
let testWord = 'cat';
let simpleDictionary = ['act', 'tac', 'bat', 'tab', 'cat', 'dog'];

printData(\`Finding anagrams of "\$\{testWord\}":\`);
printData('All permutations:');
printData(getPermutations(testWord));

printData('Valid anagrams:');
printData(findAnagrams(testWord, simpleDictionary));

printData('---');

// Problem: Find the shortest path in a simple grid
function findShortestPath(grid, start, end) {
    let queue = [{pos: start, path: [start]}];
    let visited = new Set();
    visited.add(\`\$\{start[0]\},\$\{start[1]\}\`);
    
    let directions = [[0,1], [1,0], [0,-1], [-1,0]]; // right, down, left, up
    
    while (queue.length > 0) {
        let {pos, path} = queue.shift();
        let [x, y] = pos;
        
        if (x === end[0] && y === end[1]) {
            return path;
        }
        
        for (let [dx, dy] of directions) {
            let newX = x + dx;
            let newY = y + dy;
            let newPos = [newX, newY];
            let posKey = \`\$\{newX\},\$\{newY\}\`;
            
            if (newX >= 0 && newX < grid.length && 
                newY >= 0 && newY < grid[0].length && 
                grid[newX][newY] === 0 && 
                !visited.has(posKey)) {
                
                visited.add(posKey);
                queue.push({pos: newPos, path: [...path, newPos]});
            }
        }
    }
    
    return null; // No path found
}

// Test pathfinding
let grid = [
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [1, 0, 0, 0]
];

printData('Grid (0 = walkable, 1 = wall):');
printData(grid);

let path = findShortestPath(grid, [0, 0], [3, 3]);
printData('Shortest path from [0,0] to [3,3]:');
printData(path);`,
    expectedOutput: "Solutions to complex problems broken down into steps",
    order: 5,
  },

  // Remote Data Course (courseId: 5)
  {
    id: 29,
    courseId: 5,
    title: "What is Remote Data?",
    description: "Learn about APIs and fetching data from servers",
    content: `## What is Remote Data?

**Remote data** means getting information from other computers on the internet!

### 🔍 What You'll Learn:

- What **APIs** are
- How data travels over the internet
- Why we need remote data

### API Basics:

\`\`\`javascript
// Making an API request
fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
\`\`\`

### Key Concepts:

- **API**: Application Programming Interface
- **HTTP**: How computers talk to each other
- **JSON**: Format for sending data

### 🌟 Your Challenge:

Try making your first API request and see what data you get back!`,
    starterCode: `// Let's fetch some data from a server!
// We'll use a test API that returns fake data

async function fetchUserData() {
    try {
        printData('Fetching user data...');
        
        // Make a request to get user information
        let response = await fetch('/api/test-data/user');
        
        if (response.ok) {
            let userData = await response.json();
            printData('User data received:');
            printData(userData);
        } else {
            printData('Error: Could not fetch user data');
            printData('Status:', response.status);
        }
    } catch (error) {
        printData('Network error:', error.message);
    }
}

async function fetchPostList() {
    try {
        printData('Fetching blog posts...');
        
        let response = await fetch('/api/test-data/posts');
        
        if (response.ok) {
            let posts = await response.json();
            printData('Blog posts received:');
            printData(posts);
            
            // Let's display just the titles
            printData('Post titles:');
            posts.forEach((post, index) => {
                printData(\`\$\{index + 1\}. \$\{post.title\}\`);
            });
        } else {
            printData('Error fetching posts');
        }
    } catch (error) {
        printData('Error:', error.message);
    }
}

// Make the requests
fetchUserData();
fetchPostList();

printData('---');
printData('Requests sent! Waiting for responses...');`,
    expectedOutput: "Data fetched from remote APIs displayed",
    order: 1,
  },
  {
    id: 30,
    courseId: 5,
    title: "GET Requests",
    description: "Learn to retrieve data from servers",
    content: `## GET Requests

**GET requests** are how we ask servers for information, like asking a librarian for a book!

### 🔍 What You'll Learn:

- How to make GET requests
- How to handle different response formats
- Error handling for network requests

### GET Request Examples:

\`\`\`javascript
// Basic GET request
fetch('/api/users')
    .then(response => response.json())
    .then(users => console.log(users));

// GET with parameters
fetch('/api/users?page=1&limit=10')
    .then(response => response.json())
    .then(data => console.log(data));
\`\`\`

### 🌟 Your Challenge:

Try fetching different types of data and see how the format changes!`,
    starterCode: `// Different types of GET requests

// 1. Get a single item by ID
async function getUserById(id) {
    try {
        printData(\`Getting user with ID: \$\{id\}\`);
        
        let response = await fetch(\`/api/test-data/user/\$\{id\}\`);
        
        if (response.ok) {
            let user = await response.json();
            printData('User found:');
            printData(user);
        } else if (response.status === 404) {
            printData('User not found!');
        } else {
            printData('Error:', response.status);
        }
    } catch (error) {
        printData('Network error:', error.message);
    }
}

// 2. Get a list with query parameters
async function searchPosts(query) {
    try {
        printData(\`Searching for posts about: \$\{query\}\`);
        
        let response = await fetch(\`/api/test-data/posts/search?q=\$\{query\}\`);
        
        if (response.ok) {
            let results = await response.json();
            printData('Search results:');
            printData(results);
            
            if (results.length === 0) {
                printData('No posts found matching your search.');
            }
        } else {
            printData('Search failed:', response.status);
        }
    } catch (error) {
        printData('Error:', error.message);
    }
}

// 3. Get data with headers
async function getProtectedData() {
    try {
        printData('Getting protected data...');
        
        let response = await fetch('/api/test-data/protected', {
            headers: {
                'Authorization': 'Bearer demo-token',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            let data = await response.json();
            printData('Protected data:');
            printData(data);
        } else if (response.status === 401) {
            printData('Unauthorized: Need valid token');
        } else {
            printData('Error:', response.status);
        }
    } catch (error) {
        printData('Error:', error.message);
    }
}

// Test all different GET requests
getUserById(1);
getUserById(999); // This should give a 404 error
searchPosts('javascript');
getProtectedData();

printData('All GET requests sent!');`,
    expectedOutput:
      "Various GET requests with different responses and error handling",
    order: 2,
  },
  {
    id: 31,
    courseId: 5,
    title: "POST Requests",
    description: "Learn to send data to servers",
    content: `## POST Requests

**POST requests** let us send information to servers, like filling out a form!

### 🔍 What You'll Learn:

- How to send data with POST requests
- Different data formats (JSON, form data)
- Handling server responses

### POST Request Examples:

\`\`\`javascript
// Sending JSON data
fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'John',
        email: 'john@example.com'
    })
})
.then(response => response.json())
.then(data => console.log(data));
\`\`\`

### 🌟 Your Challenge:

Try creating different types of data and sending them to the server!`,
    starterCode: `// Different types of POST requests

// 1. Create a new user
async function createUser(userData) {
    try {
        printData('Creating new user...');
        printData('Data to send:', userData);
        
        let response = await fetch('/api/test-data/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            let newUser = await response.json();
            printData('User created successfully:');
            printData(newUser);
        } else {
            printData('Failed to create user:', response.status);
        }
    } catch (error) {
        printData('Error:', error.message);
    }
}

// 2. Submit a form
async function submitContactForm(formData) {
    try {
        printData('Submitting contact form...');
        printData('Form data:', formData);
        
        let response = await fetch('/api/test-data/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            let result = await response.json();
            printData('Form submitted successfully:');
            printData(result);
        } else {
            printData('Form submission failed:', response.status);
        }
    } catch (error) {
        printData('Error:', error.message);
    }
}

// 3. Upload some data
async function uploadData(data) {
    try {
        printData('Uploading data...');
        
        let response = await fetch('/api/test-data/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            let result = await response.json();
            printData('Data uploaded:');
            printData(result);
        } else {
            printData('Upload failed:', response.status);
        }
    } catch (error) {
        printData('Error:', error.message);
    }
}

// Test POST requests
createUser({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 25
});

submitContactForm({
    name: 'Bob Smith',
    email: 'bob@example.com',
    message: 'Hello from the course!'
});

uploadData({
    type: 'learning-progress',
    course: 'Remote Data',
    completed: true,
    score: 95
});

printData('All POST requests sent!');`,
    expectedOutput: "Various POST requests sending data to the server",
    order: 3,
  },
  {
    id: 32,
    courseId: 5,
    title: "Error Handling",
    description: "Learn to handle different types of errors",
    content: `## Error Handling

Sometimes things go wrong when talking to servers. Let's learn how to **handle errors gracefully**!

### 🔍 What You'll Learn:

- Different types of errors (network, server, client)
- **HTTP status codes**
- How to retry failed requests

### Error Handling Examples:

\`\`\`javascript
fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => {
        console.error('Error:', error.message);
    });
\`\`\`

### Common Status Codes:

- **200**: Success
- **404**: Not Found
- **500**: Server Error

### 🌟 Your Challenge:

Try making requests that will fail and see how to handle them!`,
    starterCode: `// Error handling for different scenarios

// 1. Network timeout
async function fetchWithTimeout(url, timeout = 5000) {
    try {
        printData(\`Fetching \$\{url\} with \$\{timeout\}ms timeout...\`);
        
        let controller = new AbortController();
        let timeoutId = setTimeout(() => controller.abort(), timeout);
        
        let response = await fetch(url, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            let data = await response.json();
            printData('Data received:');
            printData(data);
        } else {
            printData('Server error:', response.status);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            printData('Request timed out!');
        } else {
            printData('Network error:', error.message);
        }
    }
}

// 2. Retry mechanism
async function fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            printData(\`Attempt \$\{attempt\} of \$\{maxRetries\}\`);
            
            let response = await fetch(url);
            
            if (response.ok) {
                let data = await response.json();
                printData('Success on attempt', attempt);
                printData(data);
                return data;
            } else {
                printData(\`Attempt \$\{attempt\} failed with status: \$\{response.status\}\`);
                
                if (attempt === maxRetries) {
                    printData('All attempts failed!');
                }
            }
        } catch (error) {
            printData(\`Attempt \$\{attempt\} error: \$\{error.message\}\`);
            
            if (attempt === maxRetries) {
                printData('All retry attempts failed!');
            }
        }
        
        // Wait before retry (except on last attempt)
        if (attempt < maxRetries) {
            printData('Waiting 1 second before retry...');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// 3. Handle different error types
async function handleDifferentErrors() {
    let testUrls = [
        '/api/test-data/success',      // Should work
        '/api/test-data/notfound',     // 404 error
        '/api/test-data/server-error', // 500 error
        '/api/test-data/timeout'       // Timeout error
    ];
    
    for (let url of testUrls) {
        try {
            printData(\`Testing: \$\{url\}\`);
            
            let response = await fetch(url);
            
            if (response.ok) {
                let data = await response.json();
                printData('✓ Success:', data);
            } else {
                // Handle specific error codes
                switch (response.status) {
                    case 404:
                        printData('✗ Not Found: The resource does not exist');
                        break;
                    case 500:
                        printData('✗ Server Error: Something went wrong on the server');
                        break;
                    case 403:
                        printData('✗ Forbidden: You do not have permission');
                        break;
                    default:
                        printData(\`✗ Error: \$\{response.status\} - \$\{response.statusText\}\`);
                }
            }
        } catch (error) {
            printData(\`✗ Network Error: \$\{error.message\}\`);
        }
        
        printData('---');
    }
}

// Test all error handling
fetchWithTimeout('/api/test-data/user', 3000);
fetchWithRetry('/api/test-data/unreliable');
handleDifferentErrors();`,
    expectedOutput: "Different error scenarios and how to handle them",
    order: 4,
  },
  {
    id: 33,
    courseId: 5,
    title: "Real-World API Integration",
    description: "Put it all together with a complete example",
    content: `## Real-World API Integration

Let's build a **complete application** that uses everything we've learned!

### 🔍 What You'll Learn:

- Combining GET and POST requests
- Managing application state
- Creating a real user interface

### Complete Example:

\`\`\`javascript
class TodoApp {
    constructor() {
        this.todos = [];
        this.loadTodos();
    }
    
    async loadTodos() {
        const response = await fetch('/api/todos');
        this.todos = await response.json();
        this.render();
    }
    
    async addTodo(text) {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const newTodo = await response.json();
        this.todos.push(newTodo);
        this.render();
    }
}
\`\`\`

### 🌟 Your Challenge:

Try extending this example with more features!`,
    starterCode: `// A complete todo list application using remote data

class TodoApp {
    constructor() {
        this.todos = [];
        this.init();
    }
    
    async init() {
        printData('Starting Todo App...');
        await this.loadTodos();
        this.displayTodos();
    }
    
    async loadTodos() {
        try {
            printData('Loading todos from server...');
            
            let response = await fetch('/api/test-data/todos');
            
            if (response.ok) {
                this.todos = await response.json();
                printData(\`Loaded \$\{this.todos.length\} todos\`);
            } else {
                printData('Failed to load todos, using empty list');
                this.todos = [];
            }
        } catch (error) {
            printData('Error loading todos:', error.message);
            this.todos = [];
        }
    }
    
    async addTodo(text) {
        try {
            printData(\`Adding todo: "\$\{text\}"\`);
            
            let response = await fetch('/api/test-data/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    completed: false
                })
            });
            
            if (response.ok) {
                let newTodo = await response.json();
                this.todos.push(newTodo);
                printData('Todo added successfully');
                this.displayTodos();
            } else {
                printData('Failed to add todo');
            }
        } catch (error) {
            printData('Error adding todo:', error.message);
        }
    }
    
    async toggleTodo(id) {
        try {
            let todo = this.todos.find(t => t.id === id);
            if (!todo) return;
            
            printData(\`Toggling todo: "\$\{todo.text\}"\`);
            
            let response = await fetch(\`/api/test-data/todos/\$\{id\}\`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    completed: !todo.completed
                })
            });
            
            if (response.ok) {
                todo.completed = !todo.completed;
                printData('Todo updated successfully');
                this.displayTodos();
            } else {
                printData('Failed to update todo');
            }
        } catch (error) {
            printData('Error updating todo:', error.message);
        }
    }
    
    displayTodos() {
        printData('=== Current Todos ===');
        
        if (this.todos.length === 0) {
            printData('No todos yet! Add some tasks.');
            return;
        }
        
        this.todos.forEach((todo, index) => {
            let status = todo.completed ? '✓' : '○';
            printData(\`\$\{index + 1\}. \$\{status\} \$\{todo.text\}\`);
        });
        
        let completed = this.todos.filter(t => t.completed).length;
        printData(\`\$\{completed\} of \$\{this.todos.length\} completed\`);
    }
    
    getStats() {
        let total = this.todos.length;
        let completed = this.todos.filter(t => t.completed).length;
        let remaining = total - completed;
        
        return {
            total,
            completed,
            remaining,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }
}

// Create and use the todo app
let app = new TodoApp();

// Simulate user interactions
setTimeout(() => {
    app.addTodo('Learn about APIs');
}, 1000);

setTimeout(() => {
    app.addTodo('Build a todo app');
}, 2000);

setTimeout(() => {
    app.addTodo('Deploy to production');
}, 3000);

setTimeout(() => {
    // Mark first todo as completed
    if (app.todos.length > 0) {
        app.toggleTodo(app.todos[0].id);
    }
}, 4000);

setTimeout(() => {
    printData('=== Final Stats ===');
    printData(app.getStats());
}, 5000);`,
    expectedOutput: "A complete todo application with remote data integration",
    order: 5,
  },
];

// Helper functions
export function getTutorialsByCourse(courseId: number) {
  return tutorials.filter((tutorial) => tutorial.courseId === courseId);
}

export function getCourse(id: number) {
  return courses.find((course) => course.id === id);
}

export function getTutorial(id: number) {
  return tutorials.find((tutorial) => tutorial.id === id);
}
