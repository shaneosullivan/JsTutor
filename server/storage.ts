import { type User, type InsertUser, type UserProgress, type InsertUserProgress, type Course, type InsertCourse, type Tutorial, type InsertTutorial } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  getAllTutorials(): Promise<Tutorial[]>;
  getTutorialsByCourse(courseId: number): Promise<Tutorial[]>;
  getTutorial(id: number): Promise<Tutorial | undefined>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProgress: Map<number, UserProgress>;
  private courses: Map<number, Course>;
  private tutorials: Map<number, Tutorial>;
  private currentUserId: number;
  private currentProgressId: number;
  private currentCourseId: number;
  private currentTutorialId: number;

  constructor() {
    this.users = new Map();
    this.userProgress = new Map();
    this.courses = new Map();
    this.tutorials = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentCourseId = 1;
    this.currentTutorialId = 1;
    
    this.initializeCourses();
    this.initializeTutorials();
  }

  private initializeCourses() {
    const courseData: InsertCourse[] = [
      {
        title: "Basics",
        description: "Learn the fundamentals of JavaScript programming with visual drawing",
        type: "canvas",
        order: 1,
        requiredCourse: null,
      },
      {
        title: "Array Methods",
        description: "Master array manipulation with forEach, map, filter, and more",
        type: "printData",
        order: 2,
        requiredCourse: 1,
      },
      {
        title: "DOM Manipulation",
        description: "Learn to interact with web pages and HTML elements",
        type: "iframe",
        order: 3,
        requiredCourse: 1,
      },
      {
        title: "Algorithms",
        description: "Explore problem-solving with recursion and algorithmic thinking",
        type: "printData",
        order: 4,
        requiredCourse: 1,
      },
      {
        title: "Remote Data",
        description: "Work with APIs and fetch data from servers",
        type: "printData",
        order: 5,
        requiredCourse: 1,
      },
    ];

    courseData.forEach(course => {
      const id = this.currentCourseId++;
      this.courses.set(id, { ...course, id });
    });
  }

  private initializeTutorials() {
    const tutorialData: InsertTutorial[] = [
      // Basics Course (courseId: 1)
      {
        courseId: 1,
        title: "Your First Variable",
        description: "Learn to store information",
        content: "Variables are like boxes that hold information. You can put numbers, text, or other things in them and use them later!\n\n🎨 About the Drawing Functions:\n• drawCircle(x, y, radius, color) - The first number (x) is how many pixels from the LEFT edge to place the center. The second number (y) is how many pixels from the TOP edge. The radius is how big the circle is (like measuring from the center to the edge).\n• drawText(x, y, text, color) - Places text at a position. X is pixels from left, Y is pixels from top.\n\n📍 Think of the canvas like a grid: (0,0) is the top-left corner, (400,400) is the bottom-right!\n\n🌟 Your Challenge:\nAfter trying the example, clear the code and write your own! Try creating a variable with your favorite number, then draw a circle using that number. Can you draw your initials on the canvas too?",
        starterCode: `// Let's create our first variable!
let myName = "Your Name";
let age = 9;

// Now let's draw something using our variables
drawCircle(200, 200, age * 5, 'blue');
drawText(200, 300, myName, 'black');`,
        expectedOutput: "A blue circle and your name displayed",
        order: 1,
        isLocked: false
      },
      {
        courseId: 1,
        title: "Math is Fun!",
        description: "Add, subtract, and more",
        content: "JavaScript can do math just like you! You can add (+), subtract (-), multiply (*), and divide (/) numbers.\n\n🎨 New Drawing Function:\n• drawRect(x, y, width, height, color) - Draws a rectangle! X and Y tell us where the TOP-LEFT corner goes. Width is how wide (left to right), height is how tall (top to bottom). Think of it like drawing a box!\n\n🌟 Your Challenge:\nClear the code and try this on your own! Create variables for your age and your favorite number, then do some math with them. Draw rectangles using the results - maybe make a building or a robot face!",
        starterCode: `// Let's do some math and draw with it!
let x = 100;
let y = 150;
let size = 10 + 20; // This equals 30!

drawRect(x, y, size, size, 'red');
drawRect(x + 50, y, size * 2, size, 'green');
drawRect(x + 150, y, size / 2, size, 'blue');`,
        expectedOutput: "Three rectangles of different sizes",
        order: 2,
        isLocked: true
      },
      {
        courseId: 1,
        title: "Shortcuts with Math",
        description: "Learn faster ways to do math with variables",
        content: "Sometimes you want to change a variable by adding or subtracting from it. There are shortcuts that make this easier!\n\n🚀 Math Shortcuts:\n• += means 'add to this variable' (like score += 10 means score = score + 10)\n• -= means 'subtract from this variable' (like lives -= 1 means lives = lives - 1)\n• *= means 'multiply this variable' (like size *= 2 means size = size * 2)\n• /= means 'divide this variable' (like speed /= 2 means speed = speed / 2)\n\n✨ Why Use Shortcuts?\n• They're faster to type\n• They're easier to read\n• They help prevent mistakes\n• Real programmers use them all the time!\n\n🌟 Your Challenge:\nTry changing the code to use different shortcuts. What happens if you use *= instead of +=? Can you make the squares get smaller instead of bigger?",
        starterCode: `// Let's practice math shortcuts!
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
        expectedOutput: "Three rectangles showing math shortcuts in action",
        order: 3,
        isLocked: true
      },
      {
        courseId: 1,
        title: "Simple Repeating",
        description: "Learn while loops - the easiest way to repeat code",
        content: "While loops are the simplest way to repeat code! They keep going 'while' something is true.\n\n🔄 How While Loops Work:\n• while (condition) means 'keep doing this while condition is true'\n• We need a counter variable to track how many times we've done something\n• We must change the counter inside the loop or it will go forever!\n• Much easier to understand than for loops\n\n🎨 New Drawing Function:\n• drawLine(x1, y1, x2, y2, color) - Draws a line from one point to another! The first two numbers (x1, y1) are where the line starts, and the next two (x2, y2) are where it ends.\n\n🌟 Your Challenge:\nTry changing the condition! What happens if you change 'i < 5' to 'i < 8'? Can you make the circles change color each time?",
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
        isLocked: true
      },
      {
        courseId: 1,
        title: "Advanced Repeating",
        description: "Learn for loops - a more powerful way to repeat",
        content: "For loops are a more compact way to write loops! They put the counter, condition, and increment all in one line.\n\n🚀 For Loop Structure:\n• for (start; condition; increment) - all the loop parts in parentheses\n• let i = 0 (start counting at 0)\n• i < 5 (keep going while i is less than 5)\n• i++ (add 1 to i each time - same as i += 1)\n\n🔄 For vs While:\n• For loops are more compact when you know how many times to repeat\n• While loops are clearer when the condition is more complex\n• Both do the same thing, just written differently!\n\n🌟 Your Challenge:\nTry changing the for loop numbers! What happens if you change 'i < 5' to 'i < 8'? Can you make a diagonal pattern by changing the y position too?",
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
        isLocked: true
      },
      {
        courseId: 1,
        title: "Making Decisions",
        description: "Computer choices with if statements",
        content: "Sometimes you want your program to make choices! 'If' statements let the computer decide what to do.\n\n🎨 New Drawing Function:\n• drawPixel(x, y, color) - Draws a single tiny dot at a specific position! Perfect for making detailed patterns or stars in the sky.\n\n🌟 Your Challenge:\nTry changing the numbers to see different results! Can you make it so circles appear in different colors based on different conditions?",
        starterCode: `// Let's make the computer choose colors!
for (let i = 0; i < 10; i++) {
    let x = i * 40;
    let y = 200;
    
    if (i % 2 === 0) {
        // Even numbers get blue circles
        drawCircle(x, y, 20, 'blue');
    } else {
        // Odd numbers get red squares
        drawRect(x - 10, y - 10, 20, 20, 'red');
    }
}`,
        expectedOutput: "Alternating blue circles and red squares",
        order: 6,
        isLocked: true
      },
      {
        courseId: 1,
        title: "Listening to Keys",
        description: "Make your program respond to keyboard input",
        content: "Learn to make your programs interactive! You can make things happen when keys are pressed.\n\n🎮 New Functions:\n• onKeyPress(callback) - Runs your code when ANY key is pressed\n• onArrowKeys(callback) - Runs your code when arrow keys are pressed\n• onSpaceBar(callback) - Runs your code when spacebar is pressed\n• isKeyPressed(key) - Checks if a specific key is currently being held down\n\n🌟 Your Challenge:\nTry adding your own key controls! Can you make different shapes appear when different keys are pressed?",
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
        expectedOutput: "A blue circle that moves with arrow keys and turns red with spacebar",
        order: 8,
        isLocked: true
      },
      {
        courseId: 1,
        title: "Colors and Shapes",
        description: "Learn about different colors and drawing shapes",
        content: "Let's explore different colors and learn to draw more shapes! Colors make our drawings come alive.\n\n🎨 Color Tips:\n• You can use color names like 'red', 'blue', 'green', 'purple', 'orange', 'yellow'\n• You can also use hex codes like '#FF0000' for red, '#00FF00' for green\n• Try mixing different colors to make your art colorful!\n\n🌟 Your Challenge:\nDraw a simple house using rectangles for the walls, lines for the roof, and a circle for the sun. Use at least 3 different colors!",
        starterCode: `// Let's draw with different colors!
drawRect(150, 200, 100, 80, 'brown');  // House walls
drawRect(175, 240, 20, 40, 'darkbrown'); // Door
drawLine(150, 200, 200, 150, 'red');   // Roof left
drawLine(200, 150, 250, 200, 'red');   // Roof right
drawCircle(50, 50, 30, 'yellow');      // Sun

// Try adding more to your house!
// Maybe windows? A chimney? Flowers?`,
        expectedOutput: "A colorful house with sun",
        order: 9,
        isLocked: true
      },
      {
        courseId: 1,
        title: "Making Patterns",
        description: "Use loops to create repeating patterns",
        content: "Loops help us repeat code without writing it over and over! It's like telling the computer 'do this 10 times'.\n\n🔄 About Loops:\n• A 'for loop' repeats code a certain number of times\n• We use 'i' as a counter that changes each time\n• The loop runs while i is less than the number we set\n\n✨ Loop Magic:\n• i starts at 0, then becomes 1, 2, 3, and so on\n• We can use i in our drawing to make patterns\n• i * 50 means: 0, 50, 100, 150... (perfect for spacing!)\n\n🌟 Your Challenge:\nCreate your own pattern! Try changing the numbers, colors, or shapes. What happens if you use i for the color or size?",
        starterCode: `// Let's make a pattern with a loop!
for (let i = 0; i < 5; i++) {
  drawCircle(50 + i * 60, 200, 20, 'purple');
}

// Try making a different pattern!
for (let i = 0; i < 3; i++) {
  drawRect(100 + i * 80, 300, 40, 40, 'orange');
}`,
        expectedOutput: "A pattern of purple circles and orange squares",
        order: 10,
        isLocked: true
      },
      {
        courseId: 1,
        title: "Random Fun",
        description: "Add randomness to make things unpredictable",
        content: "Random numbers make our programs exciting and different every time! It's like rolling dice in your code.\n\n🎲 Random Magic:\n• Math.random() gives us a number between 0 and 1\n• Math.random() * 400 gives us a number between 0 and 400\n• Math.floor() removes the decimal part (1.7 becomes 1)\n• This helps us get random positions on our canvas!\n\n🌈 Random Ideas:\n• Random positions for stars in the sky\n• Random colors for a rainbow\n• Random sizes for bubbles\n\n🌟 Your Challenge:\nRun your code multiple times and watch it change! Try adding more random elements - maybe random colors or sizes!",
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
        order: 11,
        isLocked: true
      },
      {
        courseId: 1,
        title: "Moving Things",
        description: "Learn to animate objects",
        content: "Animation makes things move on screen! We use setInterval to run code over and over, creating motion.\n\n⏰ About setInterval:\n• setInterval(function, milliseconds) runs code repeatedly\n• 100 milliseconds = 0.1 seconds (pretty fast!)\n• We change positions each time to create movement\n• clearCanvas() erases the old drawing before drawing the new one\n\n🏃‍♀️ Movement Tips:\n• Increase x to move right, decrease to move left\n• Increase y to move down, decrease to move up\n• Check boundaries to keep things on screen\n\n🌟 Your Challenge:\nTry changing the speed (100 to 50 for faster, 200 for slower) or direction. Can you make the ball bounce off the edges?",
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
        order: 12,
        isLocked: true
      },
      {
        courseId: 1,
        title: "Spacebar Magic",
        description: "Add special actions with the spacebar",
        content: "The spacebar is perfect for special actions! In games, it's often used for jumping, shooting, or resetting things.\n\n🚀 Spacebar Power:\n• onSpaceBar() listens specifically for the spacebar\n• Great for 'action' buttons in games\n• Can trigger special effects or reset your game\n• Works great with other keyboard controls\n\n✨ Action Ideas:\n• Jump or change color\n• Create new objects\n• Reset positions\n• Trigger animations\n\n🌟 Your Challenge:\nTry combining arrow keys AND spacebar! Maybe the spacebar changes the player's color, or creates a trail behind them?",
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
        expectedOutput: "Move with arrows, press spacebar to create colorful circles",
        order: 13,
        isLocked: true
      },
      {
        courseId: 1,
        title: "Snake Game",
        description: "Build the classic Snake game",
        content: "Let's build the famous Snake game! This combines everything we've learned: drawing, movement, keyboard controls, and game logic.\n\n🐍 Snake Game Rules:\n• Snake moves continuously in one direction\n• Arrow keys change the direction\n• Snake grows when it eats food\n• Game ends if snake hits the walls or itself\n• Score increases with each food eaten\n\n🎮 Game Programming Concepts:\n• Game loop (setInterval) keeps everything moving\n• Arrays store the snake's body segments\n• Collision detection checks for hits\n• Game state manages score and game over\n\n🌟 Your Challenge:\nTry making the game your own! Change colors, speed, or add new features. What about power-ups or obstacles?",
        starterCode: `// Snake Game!
let snake = [{x: 200, y: 200}];
let direction = 'right';
let food = {x: 150, y: 150};
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
    
    // Check food
    if (head.x === food.x && head.y === food.y) {
        food = {
            x: Math.floor(Math.random() * 20) * 20,
            y: Math.floor(Math.random() * 20) * 20
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
        food = {x: 150, y: 150};
        gameOver = false;
    }
});`,
        expectedOutput: "A playable Snake game with arrow key controls",
        order: 14,
        isLocked: true
      },
      {
        courseId: 1,
        title: "Your Own Game!",
        description: "Create your own game using everything you've learned",
        content: "Congratulations! You've learned all the basics of programming and game development. Now it's time to create something totally your own!\n\n🎯 What You Can Build:\n• A different type of game (Pong, Pac-Man style, platformer)\n• An interactive art program\n• A physics simulation\n• A drawing tool with special effects\n• Your own twist on Snake\n\n🛠️ Tools You've Mastered:\n• Drawing shapes and colors\n• Variables and math\n• Loops and patterns\n• Random numbers\n• Animation with setInterval\n• Keyboard controls\n• Game logic and collision detection\n\n🌟 Your Challenge:\nStart with a blank canvas and create something amazing! Don't be afraid to experiment, break things, and try new ideas. Programming is all about creativity and problem-solving!",
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
        order: 15,
        isLocked: true
      },

      // Array Methods Course (courseId: 2)
      {
        courseId: 2,
        title: "Introduction to Arrays",
        description: "Learn what arrays are and how to use them",
        content: "Arrays are like lists that can hold multiple items. Instead of having separate variables for each item, you can store them all in one place!\n\n🔍 What You'll Learn:\n• How to create arrays\n• How to access items in arrays\n• Why arrays are useful for organizing data\n\n🌟 Your Challenge:\nTry creating your own array with different items. Use printData() to see what's inside!",
        starterCode: `// Let's create our first array!
let fruits = ['apple', 'banana', 'orange', 'grape'];

// Print the whole array
printData(fruits);

// Access individual items (arrays start counting from 0!)
printData(fruits[0]); // First item
printData(fruits[2]); // Third item

// Check how many items we have
printData(fruits.length);`,
        expectedOutput: "Array contents and individual items displayed",
        order: 1,
        isLocked: false
      },
      {
        courseId: 2,
        title: "forEach - Do Something with Each Item",
        description: "Loop through arrays the easy way",
        content: "forEach is like a magic loop that goes through each item in your array automatically!\n\n🔍 What You'll Learn:\n• How forEach works\n• How to access each item and its position\n• Why forEach is better than regular for loops for arrays\n\n🌟 Your Challenge:\nTry using forEach with your own array. Maybe an array of your favorite colors or numbers!",
        starterCode: `// Let's use forEach to go through an array!
let numbers = [2, 4, 6, 8, 10];

printData('Original array:');
printData(numbers);

printData('Each number doubled:');
numbers.forEach((number, index) => {
    let doubled = number * 2;
    printData(\`Position \${index}: \${number} doubled is \${doubled}\`);
});

// Let's try with names
let names = ['Alice', 'Bob', 'Charlie'];
printData('Greeting each person:');
names.forEach((name) => {
    printData(\`Hello, \${name}!\`);
});`,
        expectedOutput: "Each array item processed and displayed",
        order: 2,
        isLocked: true
      },
      {
        courseId: 2,
        title: "map - Transform Each Item",
        description: "Create a new array by changing each item",
        content: "map is like a factory that takes each item in your array, transforms it, and creates a new array with the results!\n\n🔍 What You'll Learn:\n• How map transforms arrays\n• The difference between map and forEach\n• How to create new arrays from existing ones\n\n🌟 Your Challenge:\nTry mapping numbers to their squares, or words to their lengths!",
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
        order: 3,
        isLocked: true
      },
      {
        courseId: 2,
        title: "filter - Keep Only Some Items",
        description: "Create a new array with only the items you want",
        content: "filter is like a gatekeeper that only lets certain items through to create a new array!\n\n🔍 What You'll Learn:\n• How filter selects items\n• How to write conditions for filtering\n• Creating subsets of your data\n\n🌟 Your Challenge:\nTry filtering for your favorite items, or numbers that meet certain conditions!",
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
        order: 4,
        isLocked: true
      },
      {
        courseId: 2,
        title: "reduce - Combine All Items",
        description: "Combine all array items into a single value",
        content: "reduce is like a blender that combines all your array items into one result!\n\n🔍 What You'll Learn:\n• How reduce combines items\n• How to use an accumulator\n• Common reduce patterns\n\n🌟 Your Challenge:\nTry using reduce to find the longest word, or to count how many times each item appears!",
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
        order: 5,
        isLocked: true
      },

      // DOM Manipulation Course (courseId: 3)
      {
        courseId: 3,
        title: "Finding Elements",
        description: "Learn to find and select HTML elements",
        content: "The DOM (Document Object Model) is like a map of your webpage. You can find any element and change it!\n\n🔍 What You'll Learn:\n• How to find elements by ID, class, and tag\n• The difference between querySelector and querySelectorAll\n• How to check if elements exist\n\n🌟 Your Challenge:\nTry finding different elements and changing their text!",
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
        order: 1,
        isLocked: false
      },
      {
        courseId: 3,
        title: "Changing Styles",
        description: "Make your webpage look different with JavaScript",
        content: "You can change how elements look using JavaScript! Change colors, sizes, positions, and more.\n\n🔍 What You'll Learn:\n• How to change CSS properties with JavaScript\n• How to add and remove CSS classes\n• How to create visual effects\n\n🌟 Your Challenge:\nTry changing different style properties and see what happens!",
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
        order: 2,
        isLocked: true
      },
      {
        courseId: 3,
        title: "Creating New Elements",
        description: "Add new HTML elements with JavaScript",
        content: "You can create brand new HTML elements and add them to your page!\n\n🔍 What You'll Learn:\n• How to create new elements\n• How to add them to the page\n• How to remove elements\n\n🌟 Your Challenge:\nTry creating different types of elements and adding them in different places!",
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
            newParagraph.textContent = \`This is paragraph number \${counter}\`;
            newParagraph.style.color = 'blue';
            
            // Add it to the container
            container.appendChild(newParagraph);
            counter++;
        });

        // Add list item button
        document.getElementById('addListBtn').addEventListener('click', () => {
            let newListItem = document.createElement('li');
            newListItem.textContent = \`List item \${counter}\`;
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
            div.textContent = \`Auto-created div \${i}\`;
            div.style.backgroundColor = 'lightblue';
            div.style.margin = '5px';
            div.style.padding = '10px';
            container.appendChild(div);
        }
    </script>
</body>
</html>`,
        expectedOutput: "A webpage where you can create and remove elements",
        order: 3,
        isLocked: true
      },
      {
        courseId: 3,
        title: "Working with Forms",
        description: "Get input from users with forms",
        content: "Forms let users type information and interact with your webpage!\n\n🔍 What You'll Learn:\n• How to get values from input fields\n• How to respond to form submissions\n• How to validate user input\n\n🌟 Your Challenge:\nTry adding more form fields and creating a more complex form!",
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
            preview.textContent = event.target.value ? \`Hello, \${event.target.value}!\` : '';
        });
    </script>
</body>
</html>`,
        expectedOutput: "A working form that collects and displays user information",
        order: 4,
        isLocked: true
      },

      // Algorithms Course (courseId: 4)
      {
        courseId: 4,
        title: "What Are Algorithms?",
        description: "Learn what algorithms are and why they're important",
        content: "An algorithm is like a recipe - it's a set of steps to solve a problem!\n\n🔍 What You'll Learn:\n• What algorithms are\n• How to break down problems into steps\n• Why algorithms are everywhere\n\n🌟 Your Challenge:\nTry creating your own algorithm to solve a simple problem!",
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
    printData(\`"\${word}" is \${result ? 'a palindrome' : 'not a palindrome'}\`);
});`,
        expectedOutput: "Algorithm results for finding largest number and checking palindromes",
        order: 1,
        isLocked: false
      },
      {
        courseId: 4,
        title: "Searching Algorithms",
        description: "Learn different ways to find things in lists",
        content: "There are many ways to search for items in a list. Let's explore the most common ones!\n\n🔍 What You'll Learn:\n• Linear search (checking each item one by one)\n• Binary search (for sorted lists)\n• When to use each method\n\n🌟 Your Challenge:\nTry searching for different items and see how many steps each algorithm takes!",
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

printData(\`Binary search was \${linearResult.steps - binaryResult.steps} steps faster!\`);`,
        expectedOutput: "Comparison of linear and binary search algorithms",
        order: 2,
        isLocked: true
      },
      {
        courseId: 4,
        title: "Sorting Algorithms",
        description: "Learn how to put things in order",
        content: "Sorting is putting things in order - like organizing your toys by size or alphabetically!\n\n🔍 What You'll Learn:\n• Bubble sort (compare neighbors)\n• Selection sort (find the smallest)\n• How different sorting methods work\n\n🌟 Your Challenge:\nTry sorting different types of data - numbers, words, or even custom objects!",
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
        isLocked: true
      },
      {
        courseId: 4,
        title: "Introduction to Recursion",
        description: "Learn how functions can call themselves",
        content: "Recursion is when a function calls itself! It's like looking in a mirror that reflects another mirror.\n\n🔍 What You'll Learn:\n• What recursion is\n• How to write recursive functions\n• When recursion is useful\n\n🌟 Your Challenge:\nTry writing your own recursive function to solve a problem!",
        starterCode: `// Recursive function to calculate factorial
// 5! = 5 × 4 × 3 × 2 × 1 = 120
function factorial(n) {
    printData(\`Calculating factorial of \${n}\`);
    
    // Base case - when to stop
    if (n === 0 || n === 1) {
        printData(\`Base case: \${n}! = 1\`);
        return 1;
    }
    
    // Recursive case - function calls itself
    let result = n * factorial(n - 1);
    printData(\`\${n}! = \${n} × \${n-1}! = \${result}\`);
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
    printData(\`Sum up to \${n} = \${n} + sum up to \${n-1} = \${result}\`);
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
    printData(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
        expectedOutput: "Step-by-step recursive calculations for factorial, sum, and Fibonacci",
        order: 4,
        isLocked: true
      },
      {
        courseId: 4,
        title: "Problem Solving Strategies",
        description: "Learn how to approach complex problems",
        content: "Breaking down big problems into smaller ones is the key to solving anything!\n\n🔍 What You'll Learn:\n• Divide and conquer approach\n• How to identify patterns\n• Step-by-step problem solving\n\n🌟 Your Challenge:\nTry solving a complex problem by breaking it down into smaller parts!",
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

printData(\`Finding anagrams of "\${testWord}":\`);
printData('All permutations:');
printData(getPermutations(testWord));

printData('Valid anagrams:');
printData(findAnagrams(testWord, simpleDictionary));

printData('---');

// Problem: Find the shortest path in a simple grid
function findShortestPath(grid, start, end) {
    let queue = [{pos: start, path: [start]}];
    let visited = new Set();
    visited.add(\`\${start[0]},\${start[1]}\`);
    
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
            let posKey = \`\${newX},\${newY}\`;
            
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
        isLocked: true
      },

      // Remote Data Course (courseId: 5)
      {
        courseId: 5,
        title: "What is Remote Data?",
        description: "Learn about APIs and fetching data from servers",
        content: "Remote data means getting information from other computers on the internet!\n\n🔍 What You'll Learn:\n• What APIs are\n• How data travels over the internet\n• Why we need remote data\n\n🌟 Your Challenge:\nTry making your first API request and see what data you get back!",
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
                printData(\`\${index + 1}. \${post.title}\`);
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
        isLocked: false
      },
      {
        courseId: 5,
        title: "GET Requests",
        description: "Learn to retrieve data from servers",
        content: "GET requests are how we ask servers for information, like asking a librarian for a book!\n\n🔍 What You'll Learn:\n• How to make GET requests\n• How to handle different response formats\n• Error handling for network requests\n\n🌟 Your Challenge:\nTry fetching different types of data and see how the format changes!",
        starterCode: `// Different types of GET requests

// 1. Get a single item by ID
async function getUserById(id) {
    try {
        printData(\`Getting user with ID: \${id}\`);
        
        let response = await fetch(\`/api/test-data/user/\${id}\`);
        
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
        printData(\`Searching for posts about: \${query}\`);
        
        let response = await fetch(\`/api/test-data/posts/search?q=\${query}\`);
        
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
        expectedOutput: "Various GET requests with different responses and error handling",
        order: 2,
        isLocked: true
      },
      {
        courseId: 5,
        title: "POST Requests",
        description: "Learn to send data to servers",
        content: "POST requests let us send information to servers, like filling out a form!\n\n🔍 What You'll Learn:\n• How to send data with POST requests\n• Different data formats (JSON, form data)\n• Handling server responses\n\n🌟 Your Challenge:\nTry creating different types of data and sending them to the server!",
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
        isLocked: true
      },
      {
        courseId: 5,
        title: "Error Handling",
        description: "Learn to handle different types of errors",
        content: "Sometimes things go wrong when talking to servers. Let's learn how to handle errors gracefully!\n\n🔍 What You'll Learn:\n• Different types of errors (network, server, client)\n• HTTP status codes\n• How to retry failed requests\n\n🌟 Your Challenge:\nTry making requests that will fail and see how to handle them!",
        starterCode: `// Error handling for different scenarios

// 1. Network timeout
async function fetchWithTimeout(url, timeout = 5000) {
    try {
        printData(\`Fetching \${url} with \${timeout}ms timeout...\`);
        
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
            printData(\`Attempt \${attempt} of \${maxRetries}\`);
            
            let response = await fetch(url);
            
            if (response.ok) {
                let data = await response.json();
                printData('Success on attempt', attempt);
                printData(data);
                return data;
            } else {
                printData(\`Attempt \${attempt} failed with status: \${response.status}\`);
                
                if (attempt === maxRetries) {
                    printData('All attempts failed!');
                }
            }
        } catch (error) {
            printData(\`Attempt \${attempt} error: \${error.message}\`);
            
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
            printData(\`Testing: \${url}\`);
            
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
                        printData(\`✗ Error: \${response.status} - \${response.statusText}\`);
                }
            }
        } catch (error) {
            printData(\`✗ Network Error: \${error.message}\`);
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
        isLocked: true
      },
      {
        courseId: 5,
        title: "Real-World API Integration",
        description: "Put it all together with a complete example",
        content: "Let's build a complete application that uses everything we've learned!\n\n🔍 What You'll Learn:\n• Combining GET and POST requests\n• Managing application state\n• Creating a real user interface\n\n🌟 Your Challenge:\nTry extending this example with more features!",
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
                printData(\`Loaded \${this.todos.length} todos\`);
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
            printData(\`Adding todo: "\${text}"\`);
            
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
            
            printData(\`Toggling todo: "\${todo.text}"\`);
            
            let response = await fetch(\`/api/test-data/todos/\${id}\`, {
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
            printData(\`\${index + 1}. \${status} \${todo.text}\`);
        });
        
        let completed = this.todos.filter(t => t.completed).length;
        printData(\`\${completed} of \${this.todos.length} completed\`);
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
        isLocked: true
      },
    ];

    tutorialData.forEach(tutorial => {
      const id = this.currentTutorialId++;
      this.tutorials.set(id, { ...tutorial, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Create initial progress
    const progress: UserProgress = {
      id: this.currentProgressId++,
      userId: id,
      completedTutorials: [],
      currentTutorial: 1,
      currentCourse: 1,
      completedCourses: [],
      stars: 0,
    };
    this.userProgress.set(id, progress);
    
    return user;
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(userId);
  }

  async updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress> {
    const existing = this.userProgress.get(userId);
    if (!existing) {
      throw new Error(`User progress not found for user ${userId}`);
    }
    
    const updated: UserProgress = { ...existing, ...progress };
    this.userProgress.set(userId, updated);
    return updated;
  }

  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).sort((a, b) => a.order - b.order);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const newCourse: Course = { ...course, id };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  // Tutorial methods
  async getAllTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values()).sort((a, b) => a.order - b.order);
  }

  async getTutorialsByCourse(courseId: number): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values())
      .filter(t => t.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getTutorial(id: number): Promise<Tutorial | undefined> {
    return this.tutorials.get(id);
  }

  async createTutorial(tutorial: InsertTutorial): Promise<Tutorial> {
    const id = this.currentTutorialId++;
    const newTutorial: Tutorial = { ...tutorial, id };
    this.tutorials.set(id, newTutorial);
    return newTutorial;
  }
}

export const storage = new MemStorage();