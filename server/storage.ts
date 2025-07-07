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
        content: "Variables are like boxes that hold information. You can put numbers, text, or other things in them and use them later!",
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
        content: "JavaScript can do math just like you! You can add (+), subtract (-), multiply (*), and divide (/) numbers.",
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
        content: "Sometimes we want our code to do different things depending on what's happening. That's where if/else comes in!",
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
        content: "Functions are like recipes - they tell the computer how to do something step by step. You can use them over and over!",
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
        content: "While loops keep doing something as long as a condition is true. It's like saying 'keep doing this until...'",
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
        content: "For loops are perfect when you know exactly how many times you want to repeat something. Like counting from 1 to 10!",
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
        content: "Arrays are like lists that can hold many items. You can store numbers, colors, names, or anything else!",
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
        content: "Now let's combine everything we learned to create amazing patterns and designs!",
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
        content: "Let's make our drawings move and change over time! This is where programming gets really exciting!",
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
        content: "Congratulations! You've learned so much! Now let's create your very own interactive game!",
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
