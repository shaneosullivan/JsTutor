import { Book, Code, Palette, Mouse, Zap, Info, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      { name: "centerX", type: "number", description: "X coordinate of center" },
      { name: "centerY", type: "number", description: "Y coordinate of center" },
      { name: "radius", type: "number", description: "Circle radius in pixels" },
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
      { name: "y", type: "number", description: "Y coordinate for text baseline" },
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
      { name: "callback", type: "function", description: "Function to call when a key is pressed, receives (key, preventDefault)" }
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
    description: "Listen specifically for arrow key presses (up, down, left, right)",
    parameters: [
      { name: "callback", type: "function", description: "Function to call when arrow keys are pressed, receives (direction, preventDefault)" }
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
      { name: "callback", type: "function", description: "Function to call when spacebar is pressed" }
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
      { name: "key", type: "string", description: "The key to check (e.g., 'w', 'a', 's', 'd', 'arrowup')" }
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
  { name: "Basic Colors", colors: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"] },
  { name: "Extended Colors", colors: ["lightblue", "darkgreen", "lightgray", "darkgray", "cyan", "magenta", "lime", "navy"] },
  { name: "Hex Colors", colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080"] }
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

export default function ApiDocumentation() {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basic": return <Zap className="w-4 h-4" />;
      case "shapes": return <Palette className="w-4 h-4" />;
      case "text": return <Book className="w-4 h-4" />;
      case "utility": return <Mouse className="w-4 h-4" />;
      case "events": return <Gamepad2 className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basic": return "bg-yellow-100 text-yellow-800";
      case "shapes": return "bg-blue-100 text-blue-800";
      case "text": return "bg-green-100 text-green-800";
      case "utility": return "bg-purple-100 text-purple-800";
      case "events": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Drawing Functions Reference
          </h1>
          <p className="text-slate-600">
            All the functions you can use to create amazing drawings and interactive experiences!
          </p>
        </div>

        <Tabs defaultValue="functions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="functions" className="space-y-4">
            <div className="grid gap-4">
              {drawingFunctions.map((func, index) => (
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
                        <span className="text-sm font-medium text-slate-700">Syntax</span>
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
                            <div key={i} className="flex items-center gap-3 text-sm">
                              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {param.name}
                              </code>
                              <span className="text-slate-600">{param.type}</span>
                              <span className="text-slate-700">{param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-900 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Example</span>
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

          <TabsContent value="colors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-500" />
                  Available Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Color Formats</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• <strong>Color names:</strong> 'red', 'blue', 'green', etc.</li>
                    <li>• <strong>Hex colors:</strong> '#FF0000', '#00FF00', '#0000FF', etc.</li>
                    <li>• <strong>RGB colors:</strong> 'rgb(255, 0, 0)', 'rgb(0, 255, 0)', etc.</li>
                  </ul>
                </div>

                {colorExamples.map((group, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-slate-700 mb-3">{group.name}</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {group.colors.map((color, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-white border rounded-lg">
                          <div 
                            className="w-6 h-6 rounded border border-slate-300"
                            style={{ backgroundColor: color }}
                          />
                          <code className="text-xs text-slate-700">{color}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <div className="grid gap-4">
              {codeExamples.map((example, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="w-5 h-5 text-green-500" />
                      {example.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <pre className="text-sm text-green-300 overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      Copy this code into the editor and click "Run Code" to see it in action!
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