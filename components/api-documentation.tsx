import {
  Book,
  Code,
  Palette,
  Mouse,
  Zap,
  Info,
  Gamepad2,
  Copy,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const drawingFunctions = [
  {
    name: "drawPixel",
    syntax: "drawPixel(x, y, color)",
    description: "Draw a single pixel at the specified position",
    parameters: [
      { name: "x", type: "number", description: "X coordinate (0-400)" },
      { name: "y", type: "number", description: "Y coordinate (0-400)" },
      { name: "color", type: "string", description: "Color name or hex code" }
    ],
    example: `drawPixel(100, 100, 'red');
drawPixel(200, 200, '#FF0000');`,
    category: "basic"
  },
  {
    name: "drawCircle",
    syntax: "drawCircle(centerX, centerY, radius, color)",
    description: "Draw a filled circle at the specified center position",
    parameters: [
      {
        name: "centerX",
        type: "number",
        description: "X coordinate of center"
      },
      {
        name: "centerY",
        type: "number",
        description: "Y coordinate of center"
      },
      {
        name: "radius",
        type: "number",
        description: "Circle radius in pixels"
      },
      { name: "color", type: "string", description: "Fill color" }
    ],
    example: `drawCircle(200, 200, 50, 'blue');
drawCircle(100, 100, 25, '#00FF00');`,
    category: "shapes"
  },
  {
    name: "drawLine",
    syntax: "drawLine(x1, y1, x2, y2, color)",
    description: "Draw a line between two points",
    parameters: [
      { name: "x1", type: "number", description: "Starting X coordinate" },
      { name: "y1", type: "number", description: "Starting Y coordinate" },
      { name: "x2", type: "number", description: "Ending X coordinate" },
      { name: "y2", type: "number", description: "Ending Y coordinate" },
      { name: "color", type: "string", description: "Line color" }
    ],
    example: `drawLine(0, 0, 100, 100, 'black');
drawLine(50, 200, 350, 200, 'red');`,
    category: "shapes"
  },
  {
    name: "drawRect",
    syntax: "drawRect(x, y, width, height, color)",
    description: "Draw a filled rectangle starting at the top-left corner",
    parameters: [
      { name: "x", type: "number", description: "Top-left X coordinate" },
      { name: "y", type: "number", description: "Top-left Y coordinate" },
      { name: "width", type: "number", description: "Rectangle width" },
      { name: "height", type: "number", description: "Rectangle height" },
      { name: "color", type: "string", description: "Fill color" }
    ],
    example: `drawRect(100, 100, 200, 100, 'purple');
drawRect(0, 0, 50, 50, '#FFD700');`,
    category: "shapes"
  },
  {
    name: "drawText",
    syntax: "drawText(x, y, text, color)",
    description: "Draw text at the specified position",
    parameters: [
      { name: "x", type: "number", description: "X coordinate for text start" },
      {
        name: "y",
        type: "number",
        description: "Y coordinate for text baseline"
      },
      { name: "text", type: "string", description: "Text to display" },
      { name: "color", type: "string", description: "Text color" }
    ],
    example: `drawText(100, 100, 'Hello World!', 'black');
drawText(200, 200, 'I love coding!', 'blue');`,
    category: "text"
  },
  {
    name: "clearCanvas",
    syntax: "clearCanvas()",
    description: "Clear the entire canvas and reset it to white",
    parameters: [],
    example: `clearCanvas();
// Canvas is now completely white`,
    category: "utility"
  },
  {
    name: "onKeyPress",
    syntax: "onKeyPress(callback)",
    description: "Listen for any key press and execute a callback function",
    parameters: [
      {
        name: "callback",
        type: "function",
        description:
          "Function to call when a key is pressed, receives (key, preventDefault)"
      }
    ],
    example: `onKeyPress((key, preventDefault) => {
  if (key === 'w') {
    drawCircle(200, 200, 10, 'red');
    preventDefault(); // Prevents default browser behavior
  }
});`,
    category: "events"
  },
  {
    name: "onArrowKeys",
    syntax: "onArrowKeys(callback)",
    description:
      "Listen specifically for arrow key presses (up, down, left, right)",
    parameters: [
      {
        name: "callback",
        type: "function",
        description:
          "Function to call when arrow keys are pressed, receives (direction, preventDefault)"
      }
    ],
    example: `let x = 200, y = 200;
onArrowKeys((direction, preventDefault) => {
  clearCanvas();
  if (direction === 'up') y -= 10;
  if (direction === 'down') y += 10;
  if (direction === 'left') x -= 10;
  if (direction === 'right') x += 10;
  drawCircle(x, y, 15, 'blue');
  preventDefault();
});`,
    category: "events"
  },
  {
    name: "onSpaceBar",
    syntax: "onSpaceBar(callback)",
    description: "Listen for spacebar presses and execute a callback function",
    parameters: [
      {
        name: "callback",
        type: "function",
        description: "Function to call when spacebar is pressed"
      }
    ],
    example: `onSpaceBar(() => {
  // Draw a random circle when spacebar is pressed
  let x = Math.random() * 400;
  let y = Math.random() * 400;
  drawCircle(x, y, 20, 'purple');
});`,
    category: "events"
  },
  {
    name: "isKeyPressed",
    syntax: "isKeyPressed(key)",
    description: "Check if a specific key is currently being held down",
    parameters: [
      {
        name: "key",
        type: "string",
        description: "The key to check (e.g., 'w', 'a', 's', 'd', 'arrowup')"
      }
    ],
    example: `// Continuous movement while keys are held
function gameLoop() {
  let x = 200, y = 200;
  if (isKeyPressed('w')) y -= 2;
  if (isKeyPressed('s')) y += 2;
  if (isKeyPressed('a')) x -= 2;
  if (isKeyPressed('d')) x += 2;
  
  clearCanvas();
  drawCircle(x, y, 10, 'green');
}
setInterval(gameLoop, 50);`,
    category: "events"
  }
];

const colorExamples = [
  {
    name: "Basic Colors",
    colors: [
      "red",
      "blue",
      "green",
      "yellow",
      "purple",
      "orange",
      "pink",
      "brown"
    ]
  },
  {
    name: "Extended Colors",
    colors: [
      "lightblue",
      "darkgreen",
      "lightgray",
      "darkgray",
      "cyan",
      "magenta",
      "lime",
      "navy"
    ]
  },
  {
    name: "Hex Colors",
    colors: [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
      "#FFA500",
      "#800080"
    ]
  }
];

const codeExamples = [
  {
    title: "Draw a House",
    code: `// Draw a simple house
drawRect(150, 200, 100, 80, 'brown');  // House body
drawRect(180, 220, 40, 60, 'darkbrown'); // Door
drawRect(160, 210, 20, 20, 'lightblue'); // Left window
drawRect(220, 210, 20, 20, 'lightblue'); // Right window
drawLine(140, 200, 200, 150, 'red');    // Left roof
drawLine(200, 150, 260, 200, 'red');    // Right roof`
  },
  {
    title: "Draw a Rainbow",
    code: `// Draw a colorful rainbow
let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
for (let i = 0; i < colors.length; i++) {
  drawRect(50 + i * 50, 100, 40, 200, colors[i]);
}`
  },
  {
    title: "Draw a Flower",
    code: `// Draw a simple flower
drawCircle(200, 200, 30, 'yellow');  // Center
drawCircle(170, 200, 20, 'pink');    // Left petal
drawCircle(230, 200, 20, 'pink');    // Right petal
drawCircle(200, 170, 20, 'pink');    // Top petal
drawCircle(200, 230, 20, 'pink');    // Bottom petal
drawLine(200, 230, 200, 350, 'green'); // Stem`
  },
  {
    title: "Interactive Drawing",
    code: `// Draw with keyboard controls
let x = 200, y = 200;

// Use arrow keys to move
onArrowKeys((direction, preventDefault) => {
  if (direction === 'up') y -= 10;
  if (direction === 'down') y += 10;
  if (direction === 'left') x -= 10;
  if (direction === 'right') x += 10;
  
  drawCircle(x, y, 5, 'red');
  preventDefault();
});

// Press spacebar to clear
onSpaceBar(() => {
  clearCanvas();
});`
  },
  {
    title: "Keyboard Paint",
    code: `// Paint with different keys
onKeyPress((key, preventDefault) => {
  let x = Math.random() * 400;
  let y = Math.random() * 400;
  
  if (key === 'r') drawCircle(x, y, 10, 'red');
  if (key === 'b') drawCircle(x, y, 10, 'blue');
  if (key === 'g') drawCircle(x, y, 10, 'green');
  if (key === 'c') clearCanvas();
  
  preventDefault();
});`
  },
  {
    title: "Smooth Movement",
    code: `// Smooth character movement
let playerX = 200, playerY = 200;

function gameLoop() {
  // Check which keys are held down
  if (isKeyPressed('w')) playerY -= 3;
  if (isKeyPressed('s')) playerY += 3;
  if (isKeyPressed('a')) playerX -= 3;
  if (isKeyPressed('d')) playerX += 3;
  
  // Keep player on screen
  playerX = Math.max(10, Math.min(390, playerX));
  playerY = Math.max(10, Math.min(390, playerY));
  
  // Draw the game
  clearCanvas();
  drawCircle(playerX, playerY, 10, 'blue');
  drawText(10, 30, 'Use WASD to move!', 'black');
}

// Run the game loop 60 times per second
setInterval(gameLoop, 16);`
  }
];

// PrintData course functions
const printDataFunctions = [
  {
    name: "printData",
    syntax: "printData(data)",
    description: "Display data in the output console",
    parameters: [
      {
        name: "data",
        type: "any",
        description:
          "The data to display - can be strings, numbers, objects, arrays, etc."
      }
    ],
    example: `printData("Hello World!");
printData(42);
printData([1, 2, 3]);
printData({ name: "Alice", age: 25 });`,
    category: "output"
  },
  {
    name: "console.log",
    syntax: "console.log(...args)",
    description: "Log messages to the browser console",
    parameters: [
      { name: "args", type: "any", description: "Multiple arguments to log" }
    ],
    example: `console.log("Debug message");
console.log("Value:", 42);
console.log("User:", { name: "Bob", age: 30 });`,
    category: "debug"
  }
];

// DOM/iframe course functions
const domFunctions = [
  {
    name: "document.getElementById",
    syntax: "document.getElementById(id)",
    description: "Find an HTML element by its ID attribute",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The ID of the element to find"
      }
    ],
    example: `let titleElement = document.getElementById('title');
let button = document.getElementById('myButton');
titleElement.textContent = 'New Title';`,
    category: "dom"
  },
  {
    name: "document.querySelector",
    syntax: "document.querySelector(selector)",
    description: "Find the first element matching a CSS selector",
    parameters: [
      {
        name: "selector",
        type: "string",
        description: "CSS selector (e.g., '.class', '#id', 'tag')"
      }
    ],
    example: `let firstParagraph = document.querySelector('p');
let redButton = document.querySelector('.red-button');
let titleById = document.querySelector('#title');`,
    category: "dom"
  },
  {
    name: "document.querySelectorAll",
    syntax: "document.querySelectorAll(selector)",
    description: "Find all elements matching a CSS selector",
    parameters: [
      { name: "selector", type: "string", description: "CSS selector" }
    ],
    example: `let allParagraphs = document.querySelectorAll('p');
let allButtons = document.querySelectorAll('button');
allParagraphs.forEach(p => p.style.color = 'blue');`,
    category: "dom"
  },
  {
    name: "element.addEventListener",
    syntax: "element.addEventListener(event, function)",
    description: "Listen for events on an element",
    parameters: [
      {
        name: "event",
        type: "string",
        description: "Event type (e.g., 'click', 'input')"
      },
      {
        name: "function",
        type: "function",
        description: "Function to call when event occurs"
      }
    ],
    example: `let button = document.getElementById('myButton');
button.addEventListener('click', () => {
  alert('Button clicked!');
});`,
    category: "events"
  },
  {
    name: "document.createElement",
    syntax: "document.createElement(tagName)",
    description: "Create a new HTML element",
    parameters: [
      {
        name: "tagName",
        type: "string",
        description: "HTML tag name (e.g., 'div', 'p', 'button')"
      }
    ],
    example: `let newParagraph = document.createElement('p');
newParagraph.textContent = 'Hello!';
document.body.appendChild(newParagraph);`,
    category: "dom"
  }
];

// Examples for different course types
const printDataExamples = [
  {
    title: "Working with Arrays",
    code: `let fruits = ['apple', 'banana', 'orange'];
printData('My favorite fruits:');
printData(fruits);

// Using array methods
let uppercaseFruits = fruits.map(fruit => fruit.toUpperCase());
printData('Uppercase fruits:');
printData(uppercaseFruits);`
  },
  {
    title: "Object Manipulation",
    code: `let person = {
  name: 'Alice',
  age: 25,
  city: 'New York'
};

printData('Person info:');
printData(person);

// Adding properties
person.job = 'Developer';
printData('Updated person:');
printData(person);`
  },
  {
    title: "Loop Through Data",
    code: `let numbers = [1, 2, 3, 4, 5];

printData('Original numbers:');
printData(numbers);

// Square each number
let squared = numbers.map(num => num * num);
printData('Squared numbers:');
printData(squared);

// Filter even numbers
let evenNumbers = numbers.filter(num => num % 2 === 0);
printData('Even numbers:');
printData(evenNumbers);`
  }
];

const domExamples = [
  {
    title: "Change Text Content",
    code: `<!DOCTYPE html>
<html>
<head>
    <title>Text Example</title>
</head>
<body>
    <h1 id="title">Original Title</h1>
    <p class="text">Original paragraph</p>
    <button onclick="changeText()">Change Text</button>
    
    <script>
        function changeText() {
            let title = document.getElementById('title');
            title.textContent = 'New Title!';
            
            let paragraph = document.querySelector('.text');
            paragraph.textContent = 'Text changed!';
        }
    </script>
</body>
</html>`
  },
  {
    title: "Interactive Button",
    code: `<!DOCTYPE html>
<html>
<head>
    <title>Button Example</title>
</head>
<body>
    <button id="colorButton">Click me!</button>
    <div id="output"></div>
    
    <script>
        let button = document.getElementById('colorButton');
        let output = document.getElementById('output');
        let clickCount = 0;
        
        button.addEventListener('click', () => {
            clickCount++;
            output.innerHTML = '<p>Clicked ' + clickCount + ' times!</p>';
            
            // Change button color
            button.style.backgroundColor = 'lightblue';
        });
    </script>
</body>
</html>`
  }
];

interface ApiDocumentationProps {
  courseType?: string;
}

export default function ApiDocumentation({
  courseType = "canvas"
}: ApiDocumentationProps) {
  const [copiedExample, setCopiedExample] = useState<number | null>(null);

  // Select appropriate data based on course type
  const functions =
    courseType === "canvas"
      ? drawingFunctions
      : courseType === "iframe"
        ? domFunctions
        : printDataFunctions;

  const examples =
    courseType === "canvas"
      ? codeExamples
      : courseType === "iframe"
        ? domExamples
        : printDataExamples;

  const title =
    courseType === "canvas"
      ? "Drawing Functions Reference"
      : courseType === "iframe"
        ? "DOM Manipulation Reference"
        : "Data Functions Reference";

  const description =
    courseType === "canvas"
      ? "All the functions you can use to create amazing drawings and interactive experiences!"
      : courseType === "iframe"
        ? "Functions to manipulate HTML elements and create interactive web pages!"
        : "Functions to work with data and display output in your programs!";

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedExample(index);
      setTimeout(() => setCopiedExample(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basic":
        return <Zap className="w-4 h-4" />;
      case "shapes":
        return <Palette className="w-4 h-4" />;
      case "text":
        return <Book className="w-4 h-4" />;
      case "utility":
        return <Mouse className="w-4 h-4" />;
      case "events":
        return <Gamepad2 className="w-4 h-4" />;
      case "output":
        return <Code className="w-4 h-4" />;
      case "debug":
        return <Info className="w-4 h-4" />;
      case "dom":
        return <Palette className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basic":
        return "bg-yellow-100 text-yellow-800";
      case "shapes":
        return "bg-blue-100 text-blue-800";
      case "text":
        return "bg-green-100 text-green-800";
      case "utility":
        return "bg-purple-100 text-purple-800";
      case "events":
        return "bg-orange-100 text-orange-800";
      case "output":
        return "bg-indigo-100 text-indigo-800";
      case "debug":
        return "bg-red-100 text-red-800";
      case "dom":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
          <p className="text-slate-600">{description}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="functions" className="w-full flex flex-col h-full">
          <div className="flex-shrink-0 px-6 pb-4">
            <TabsList
              className={`grid w-full ${courseType === "canvas" ? "grid-cols-3" : "grid-cols-2"} bg-slate-100 border border-slate-200 p-1 rounded-lg shadow-sm`}
            >
              <TabsTrigger
                value="functions"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium"
              >
                Functions
              </TabsTrigger>
              {courseType === "canvas" && (
                <TabsTrigger
                  value="colors"
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium"
                >
                  Colors
                </TabsTrigger>
              )}
              <TabsTrigger
                value="examples"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200 font-medium"
              >
                Examples
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="functions"
            className="flex-1 overflow-y-auto px-6 mt-0"
          >
            <div className="space-y-4 pb-6">
              {functions.map((func, index) => (
                <Card key={index} className="border-l-4 border-l-purple-400">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getCategoryIcon(func.category)}
                        <code className="text-purple-600">{func.name}</code>
                      </CardTitle>
                      <Badge className={getCategoryColor(func.category)}>
                        {func.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">{func.description}</p>

                    <div className="bg-slate-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">
                          Syntax
                        </span>
                      </div>
                      <code className="text-sm font-mono text-slate-800">
                        {func.syntax}
                      </code>
                    </div>

                    {func.parameters.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Parameters
                        </h4>
                        <div className="space-y-2">
                          {func.parameters.map((param, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 text-sm"
                            >
                              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {param.name}
                              </code>
                              <span className="text-slate-600">
                                {param.type}
                              </span>
                              <span className="text-slate-700">
                                {param.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-900 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">
                          Example
                        </span>
                      </div>
                      <pre className="text-sm text-green-300 overflow-x-auto">
                        <code>{func.example}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {courseType === "canvas" && (
            <TabsContent value="colors" className="flex-1 overflow-y-auto px-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-pink-500" />
                    Available Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium text-blue-800 mb-3">
                      Understanding Colors in Programming! 🎨
                    </h4>

                    <div className="space-y-4">
                      <div className="bg-white p-3 rounded border border-blue-100">
                        <h5 className="font-semibold text-blue-800 mb-2">
                          🏷️ Color Names
                        </h5>
                        <p className="text-blue-700 text-sm mb-2">
                          The easiest way! Just use simple English words like '
                          <strong>red</strong>', '<strong>blue</strong>', '
                          <strong>green</strong>'. Perfect for beginners -
                          computers understand these basic color names.
                        </p>
                        <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          drawCircle(100, 100, 50, 'red');
                        </code>
                      </div>

                      <div className="bg-white p-3 rounded border border-blue-100">
                        <h5 className="font-semibold text-blue-800 mb-2">
                          🔢 Hex Colors
                        </h5>
                        <p className="text-blue-700 text-sm mb-2">
                          <strong>Hex = Hexadecimal</strong> - a special number
                          system that goes 0-9, A-F, giving you 16 numbers. Hex
                          colors start with # and have 6 characters:{" "}
                          <strong>#RRGGBB</strong>
                        </p>
                        <ul className="text-blue-700 text-xs space-y-1 mb-2">
                          <li>
                            • <strong>RR</strong> = Red amount (00-FF)
                          </li>
                          <li>
                            • <strong>GG</strong> = Green amount (00-FF)
                          </li>
                          <li>
                            • <strong>BB</strong> = Blue amount (00-FF)
                          </li>
                          <li>
                            • <strong>00</strong> = no color,{" "}
                            <strong>FF</strong> = maximum color
                          </li>
                        </ul>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-blue-700">Examples:</span>
                          <code className="bg-red-100 text-red-800 px-1 rounded">
                            #FF0000 = pure red
                          </code>
                          <code className="bg-green-100 text-green-800 px-1 rounded">
                            #00FF00 = pure green
                          </code>
                          <code className="bg-blue-100 text-blue-800 px-1 rounded">
                            #0000FF = pure blue
                          </code>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded border border-blue-100">
                        <h5 className="font-semibold text-blue-800 mb-2">
                          🌈 RGB Colors
                        </h5>
                        <p className="text-blue-700 text-sm mb-2">
                          <strong>RGB = Red, Green, Blue</strong> - the three
                          primary colors of light! Mix different amounts (0-255)
                          to create any color you want.
                        </p>
                        <ul className="text-blue-700 text-xs space-y-1 mb-2">
                          <li>
                            • <strong>0</strong> = no light (black)
                          </li>
                          <li>
                            • <strong>255</strong> = maximum light (bright)
                          </li>
                          <li>• Mix red + green = yellow!</li>
                          <li>• Mix all three = white!</li>
                        </ul>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-blue-700">Examples:</span>
                          <code className="bg-purple-100 text-purple-800 px-1 rounded">
                            rgb(255, 0, 255) = purple
                          </code>
                          <code className="bg-yellow-100 text-yellow-800 px-1 rounded">
                            rgb(255, 255, 0) = yellow
                          </code>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-red-100 via-green-100 to-blue-100 p-3 rounded border border-blue-100">
                        <h5 className="font-semibold text-gray-800 mb-2">
                          🔬 Fun Science Fact!
                        </h5>
                        <p className="text-gray-700 text-sm">
                          Your computer screen has tiny red, green, and blue
                          lights! By mixing different amounts of these three
                          colors, it can create millions of different colors.
                          Just like mixing paint, but with light instead! 💡
                        </p>
                      </div>
                    </div>
                  </div>

                  {colorExamples.map((group, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-slate-700 mb-3">
                        {group.name}
                        {group.name === "Hex Colors" && (
                          <span className="text-sm font-normal text-slate-500 ml-2">
                            - See how the hex codes match the colors! 🔍
                          </span>
                        )}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {group.colors.map((color, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div
                              className="w-8 h-8 rounded border-2 border-slate-300 flex-shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <div className="flex-1 min-w-0">
                              <code className="text-sm text-slate-700 font-mono">
                                {color}
                              </code>
                              {group.name === "Hex Colors" && (
                                <div className="text-xs text-slate-500 mt-1">
                                  {color === "#FF0000" &&
                                    "Red: FF, Green: 00, Blue: 00"}
                                  {color === "#00FF00" &&
                                    "Red: 00, Green: FF, Blue: 00"}
                                  {color === "#0000FF" &&
                                    "Red: 00, Green: 00, Blue: FF"}
                                  {color === "#FFFF00" &&
                                    "Red: FF, Green: FF, Blue: 00 = Yellow!"}
                                  {color === "#FF00FF" &&
                                    "Red: FF, Green: 00, Blue: FF = Magenta!"}
                                  {color === "#00FFFF" &&
                                    "Red: 00, Green: FF, Blue: FF = Cyan!"}
                                  {color === "#FFA500" &&
                                    "Red: FF, Green: A5, Blue: 00 = Orange!"}
                                  {color === "#800080" &&
                                    "Red: 80, Green: 00, Blue: 80 = Purple!"}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {group.name === "Hex Colors" && (
                        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-yellow-800 text-sm">
                            💡 <strong>Pro tip:</strong> In hex codes, FF means
                            "maximum" (255 in regular numbers) and 00 means
                            "none" (0 in regular numbers). Try making your own
                            hex colors!
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="examples" className="flex-1 overflow-y-auto px-6">
            <div className="grid gap-4 pb-6">
              {examples.map((example, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="w-5 h-5 text-green-500" />
                        {example.title}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(example.code, index)}
                        className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
                      >
                        {copiedExample === index ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900 p-4 rounded-lg relative">
                      <pre className="text-sm text-green-300 overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      Copy this code into the editor and click "Run Code" to see
                      it in action!
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
