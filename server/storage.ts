import { users, userProgress, tutorials, type User, type InsertUser, type UserProgress, type InsertUserProgress, type Tutorial, type InsertTutorial } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  
  getAllTutorials(): Promise<Tutorial[]>;
  getTutorial(id: number): Promise<Tutorial | undefined>;
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProgress: Map<number, UserProgress>;
  private tutorials: Map<number, Tutorial>;
  private currentUserId: number;
  private currentProgressId: number;
  private currentTutorialId: number;

  constructor() {
    this.users = new Map();
    this.userProgress = new Map();
    this.tutorials = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentTutorialId = 1;
    
    // Initialize with sample tutorials
    this.initializeTutorials();
  }

  private initializeTutorials() {
    const tutorialData: InsertTutorial[] = [
      {
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
        isLocked: false
      },
      {
        title: "Making Decisions",
        description: "Learn if/else statements",
        content: "Sometimes we want our code to do different things depending on what's happening. That's where if/else comes in!\n\n🎨 New Drawing Function:\n• drawLine(x1, y1, x2, y2, color) - Draws a straight line! The first two numbers (x1, y1) are where the line STARTS. The next two numbers (x2, y2) are where the line ENDS. It's like drawing with a ruler!\n\n🌟 Your Challenge:\nTime to be creative! Clear the code and write your own if/else statement. Try: 'if my age is greater than 8, draw a happy face, else draw a sad face'. Use circles for the face and lines for the mouth!",
        starterCode: `// Let's draw different things based on conditions!
let isHappy = true;

if (isHappy) {
    // Draw a happy yellow sun
    drawCircle(200, 200, 50, 'yellow');
    drawCircle(185, 185, 5, 'black');
    drawCircle(215, 185, 5, 'black');
    drawLine(185, 215, 215, 215, 'black');
} else {
    // Draw a sad blue cloud
    drawCircle(200, 200, 50, 'lightblue');
    drawCircle(185, 185, 3, 'black');
    drawCircle(215, 185, 3, 'black');
    drawLine(185, 215, 215, 225, 'black');
}`,
        expectedOutput: "A happy sun or sad cloud based on the condition",
        order: 3,
        isLocked: true
      },
      {
        title: "Creating Functions",
        description: "Organize your code",
        content: "Functions are like recipes - they tell the computer how to do something step by step. You can use them over and over!\n\n💡 Function Tip: Notice how we can put numbers in parentheses after the function name? These are called 'parameters' - they're like ingredients for our recipe! The drawHouse function takes an x position, y position, and color as its ingredients.\n\n🌟 Your Challenge:\nCreate your own function! Try making a 'drawStar' or 'drawTree' function. Start with a simple shape using rectangles and circles, then call your function multiple times to fill the canvas. Make each one a different color!",
        starterCode: `// Let's create a function to draw a house!
function drawHouse(x, y, color) {
    drawRect(x, y, 60, 40, color);
    drawRect(x + 20, y + 15, 20, 25, 'brown');
    drawRect(x + 10, y + 10, 10, 10, 'lightblue');
    drawRect(x + 40, y + 10, 10, 10, 'lightblue');
}

// Now let's use our function to draw three houses!
drawHouse(100, 200, 'red');
drawHouse(200, 200, 'blue');
drawHouse(300, 200, 'green');`,
        expectedOutput: "Three colorful houses in a row",
        order: 4,
        isLocked: true
      },
      {
        title: "While Loops",
        description: "Repeat until done",
        content: "While loops keep doing something as long as a condition is true. It's like saying 'keep doing this until...'\n\n💡 Loop Tip: See how we change 'x', 'y', 'size', and 'count' each time? This makes each circle appear in a slightly different place and size, creating a spiral pattern! Without changing these values, all circles would be drawn in exactly the same spot.\n\n🌟 Your Challenge:\nWrite your own while loop from scratch! Try drawing a line of circles across the screen, or squares going down the canvas. Remember to change your variables inside the loop so it doesn't run forever!",
        starterCode: `// Let's draw a spiral using a while loop!
let x = 200;
let y = 200;
let size = 5;
let count = 0;

while (count < 20) {
    drawCircle(x, y, size, 'purple');
    x = x + size;
    y = y + 2;
    size = size + 1;
    count = count + 1;
}`,
        expectedOutput: "A spiral pattern of purple circles",
        order: 5,
        isLocked: true
      },
      {
        title: "For Loops",
        description: "Count and repeat",
        content: "For loops are perfect when you know exactly how many times you want to repeat something. Like counting from 1 to 10!\n\n💡 Array Tip: The 'colors' variable is an array - it's like a list that holds multiple colors! We use colors[i] to pick a different color each time through the loop. When i=0, we get 'red'. When i=1, we get 'orange', and so on!\n\n🌟 Your Challenge:\nCreate your own rainbow! Make an array with your favorite colors, then use a for loop to draw them. Try making circles instead of rectangles, or arrange them in a different pattern like a circle or zigzag!",
        starterCode: `// Let's draw a rainbow using a for loop!
let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

for (let i = 0; i < 6; i++) {
    drawRect(50 + i * 50, 100, 40, 200, colors[i]);
}

// Let's also draw some stars
for (let i = 0; i < 10; i++) {
    drawCircle(100 + i * 30, 50, 5, 'yellow');
}`,
        expectedOutput: "A colorful rainbow with stars above",
        order: 6,
        isLocked: true
      },
      {
        title: "Arrays & Lists",
        description: "Store many things",
        content: "Arrays are like lists that can hold many items. You can store numbers, colors, names, or anything else!\n\n💡 Array Tips:\n• Arrays use square brackets: ['red', 'blue', 'green']\n• We access items by their position: colors[0] gets the first item\n• arrays.length tells us how many items are in the list\n• Arrays start counting from 0, not 1! So the first item is [0], second is [1], etc.\n\n🌟 Your Challenge:\nBuild your own art gallery! Create two arrays - one with colors and one with sizes. Use a for loop to draw different sized shapes using both arrays. Try making each shape bigger and a different color!",
        starterCode: `// Let's create an array of colors and use them!
let colors = ['red', 'blue', 'green', 'yellow', 'purple'];
let sizes = [10, 20, 30, 40, 50];

for (let i = 0; i < colors.length; i++) {
    drawCircle(100 + i * 70, 200, sizes[i], colors[i]);
}`,
        expectedOutput: "Circles of different sizes and colors",
        order: 7,
        isLocked: true
      },
      {
        title: "Pattern Party",
        description: "Draw cool patterns",
        content: "Now let's combine everything we learned to create amazing patterns and designs!\n\n💡 Pattern Tip: This uses 'nested loops' - a loop inside another loop! The outer loop (x) makes columns, the inner loop (y) makes rows. The (x + y) % 2 is a math trick that alternates between 0 and 1, giving us the checkerboard pattern!\n\n🌟 Your Challenge:\nDesign your own pattern! Try changing the colors, using circles instead of rectangles, or creating a different mathematical pattern. What happens if you use (x * y) or (x + y + 1) instead? Be creative!",
        starterCode: `// Let's create a checkerboard pattern!
let colors = ['red', 'black'];

for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
        let colorIndex = (x + y) % 2;
        drawRect(x * 40, y * 40, 40, 40, colors[colorIndex]);
    }
}`,
        expectedOutput: "A colorful checkerboard pattern",
        order: 8,
        isLocked: true
      },
      {
        title: "Animation Fun",
        description: "Make things move",
        content: "Let's make our drawings move and change over time! This is where programming gets really exciting!\n\n🎨 New Drawing Function:\n• clearCanvas() - Erases everything on the canvas, making it white again!\n\n💡 Animation Tip: Math.sin() and Math.cos() create smooth, wave-like movements. They're like magic functions that make things move in circles and curves! The 'time' variable keeps track of how long the animation has been running.\n\n🌟 Your Challenge:\nCreate your own moving art! Try animating different shapes, changing colors over time, or making multiple objects move in different patterns. Can you make a bouncing ball or a spinning square?",
        starterCode: `// Let's create a simple animation!
let time = 0;

function animate() {
    clearCanvas();
    
    // Draw a bouncing ball
    let x = 200 + Math.sin(time) * 150;
    let y = 200 + Math.cos(time * 2) * 100;
    
    drawCircle(x, y, 20, 'red');
    
    // Draw a spinning flower
    for (let i = 0; i < 8; i++) {
        let angle = (time + i * 0.8) * Math.PI / 4;
        let petalX = 300 + Math.cos(angle) * 30;
        let petalY = 300 + Math.sin(angle) * 30;
        drawCircle(petalX, petalY, 15, 'pink');
    }
    
    time += 0.1;
}

// Start the animation
setInterval(animate, 100);`,
        expectedOutput: "A bouncing ball and spinning flower",
        order: 9,
        isLocked: true
      },
      {
        title: "Your Own Game!",
        description: "Build something awesome",
        content: "Congratulations! You've learned so much! Now let's create your very own interactive game!\n\n💡 Game Tip: This game uses everything you've learned! Variables to keep track of the score, if/else to check winning conditions, functions to organize code, and even some advanced math (Math.sqrt) to detect if clicks are inside the circle. You're a real programmer now!\n\n🌟 Your Final Challenge:\nDesign your own game! Change the target shape, add multiple targets, create power-ups, or make the target move around. You have all the tools you need to build something amazing. Show the world what you can create!",
        starterCode: `// Let's create a simple clicking game!
let score = 0;
let gameRunning = true;

function drawGame() {
    clearCanvas();
    
    // Draw the target
    drawCircle(200, 200, 50, 'red');
    drawCircle(200, 200, 30, 'white');
    drawCircle(200, 200, 10, 'red');
    
    // Draw the score
    drawText(50, 50, "Score: " + score, 'black');
    
    if (score >= 10) {
        drawText(150, 350, "You Win! Great job!", 'green');
        gameRunning = false;
    }
}

// Handle clicks (you'll learn more about this later!)
function handleClick(x, y) {
    if (gameRunning) {
        let distance = Math.sqrt((x - 200) * (x - 200) + (y - 200) * (y - 200));
        if (distance < 50) {
            score++;
            drawGame();
        }
    }
}

drawGame();`,
        expectedOutput: "An interactive clicking game",
        order: 10,
        isLocked: true
      }
    ];

    tutorialData.forEach(tutorial => {
      const id = this.currentTutorialId++;
      this.tutorials.set(id, { 
        ...tutorial, 
        id,
        expectedOutput: tutorial.expectedOutput ?? null,
        isLocked: tutorial.isLocked ?? false
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Create initial progress
    const progressId = this.currentProgressId++;
    const progress: UserProgress = {
      id: progressId,
      userId: id,
      completedTutorials: [],
      currentTutorial: 1,
      stars: 0
    };
    this.userProgress.set(id, progress);
    
    return user;
  }

  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(userId);
  }

  async updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress> {
    const existing = this.userProgress.get(userId);
    if (!existing) {
      throw new Error('User progress not found');
    }
    
    const updated: UserProgress = { ...existing, ...progress };
    this.userProgress.set(userId, updated);
    return updated;
  }

  async getAllTutorials(): Promise<Tutorial[]> {
    return Array.from(this.tutorials.values()).sort((a, b) => a.order - b.order);
  }

  async getTutorial(id: number): Promise<Tutorial | undefined> {
    return this.tutorials.get(id);
  }

  async createTutorial(tutorial: InsertTutorial): Promise<Tutorial> {
    const id = this.currentTutorialId++;
    const newTutorial: Tutorial = { 
      ...tutorial, 
      id,
      expectedOutput: tutorial.expectedOutput ?? null,
      isLocked: tutorial.isLocked ?? false
    };
    this.tutorials.set(id, newTutorial);
    return newTutorial;
  }
}

export const storage = new MemStorage();
