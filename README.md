# JavaScript Adventure 🚀

An interactive JavaScript learning platform designed for children, featuring hands-on tutorials, visual programming with canvas, AI-powered assistance, and progressive skill building across multiple specialized courses.

## Features

- **Interactive Learning Environment**: Visual code editor with real-time execution and error highlighting
- **5 Specialized Courses**:
  - **Basics** (Canvas): Visual programming with drawing functions
  - **Array Methods** (PrintData): Data manipulation and array operations
  - **DOM Manipulation** (iframe): Interactive web pages and HTML elements
  - **Algorithms** (PrintData): Logic, recursion, and problem-solving
  - **Remote Data** (PrintData): API integration and data fetching
- **AI-Powered Assistance**: OpenAI integration for personalized coding help with error detection
- **Visual Programming**: Canvas-based drawing API with keyboard event handling
- **Progressive Unlocking**: Structured learning path with tutorial dependencies
- **Persistent Progress**: LocalStorage-based progress tracking across sessions
- **Responsive Design**: Optimized for young learners with child-friendly interface
- **Console Output**: Real-time console logging with smart object serialization
- **Help System**: Comprehensive function reference with examples

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Code Editor**: CodeMirror 6 with JavaScript syntax highlighting and error detection
- **State Management**: React hooks with localStorage persistence
- **AI Integration**: OpenAI GPT-3.5-turbo for coding assistance
- **Canvas API**: Custom drawing functions for visual programming
- **Build Tool**: Next.js built-in bundler

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher

That's it! No database setup required - the application uses in-memory data storage and localStorage for progress tracking.

## Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shaneosullivan/JsTutor.git
   cd JsTutor
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open the application**:
   - Navigate to `http://localhost:3020` in your browser

## Available Scripts

```bash
# Development
npm run dev          # Start Next.js development server (port 3020)

# Production
npm run build        # Build for production
npm start           # Start production server

# Development Tools
npm run check       # Run TypeScript type checking
npm run format      # Format code with Prettier
npm run generate-icons # Generate app icons
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── courses/       # Course and tutorial endpoints
│   ├── course/[id]/       # Individual course pages
│   ├── courses/           # Course selection page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── pages/             # Page components
│   ├── ui/                # shadcn/ui components
│   ├── ai-chat.tsx        # AI assistant interface
│   ├── code-editor.tsx    # Code editor with syntax highlighting
│   ├── drawing-canvas.tsx # Canvas rendering component
│   ├── iframe-display.tsx # HTML preview component
│   └── tutorial-content.tsx # Main tutorial interface
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and data
│   ├── canvas-api.ts      # Canvas drawing functions
│   ├── data.ts            # Course and tutorial data
│   └── utils.ts           # Utility functions
├── shared/                # Shared TypeScript definitions
│   └── schema.ts          # Data models and validation
└── public/                # Static assets
```

## Course Structure

### 1. Basics Course (Canvas-based)

- **What is HTML?**: Introduction to HTML structure and DOM basics
- **Your First Variable**: Learn to store and use information
- **Maths is Fun!**: Mathematical operations and calculations
- **Interactive Drawing**: Canvas API with visual feedback
- **Keyboard Events**: Handle user input and create interactive experiences

### 2. Array Methods Course (PrintData)

- Array manipulation with forEach, map, filter, reduce
- Data transformation and processing
- Real-world data scenarios

### 3. DOM Manipulation Course (iframe)

- **What is HTML?**: HTML structure, head/body, tags, attributes
- **Finding Elements**: getElementById, querySelector, querySelectorAll
- **Changing Styles**: CSS property manipulation and classes
- **Creating New Elements**: Dynamic content creation
- **Working with Forms**: User input handling and validation

### 4. Algorithms Course (PrintData)

- Logic and problem-solving
- Recursion and algorithmic thinking
- Performance optimization

### 5. Remote Data Course (PrintData)

- API integration
- Fetch operations
- Data handling and error management

## Key Features Explained

### AI Integration

- Users provide their own OpenAI API keys through the application interface
- Context-aware assistance based on current code and errors
- Child-friendly explanations with encouraging tone
- Automatic error detection and debugging suggestions
- Chat history maintained per tutorial session

### Canvas API Functions

The platform provides a rich set of drawing functions for visual programming:

```javascript
// Basic drawing
drawPixel(x, y, color);
drawCircle(x, y, radius, color);
drawLine(x1, y1, x2, y2, color);
drawRect(x, y, width, height, color);
drawText(x, y, text, color);

// Canvas management
clearCanvas();

// Event handling
onKeyPress(callback); // Any key press
onArrowKeys(callback); // Arrow key navigation
onSpaceBar(callback); // Spacebar events
isKeyPressed(key); // Check if key is held down
```

### Console Output Enhancement

- Smart object serialization for iframe console logging
- Handles DOM objects like `document`, `window`, HTML elements
- Non-serializable objects display as descriptive text (e.g., `<document>`, `<h1#main-title>`)
- Real-time console output with proper formatting

### Progress Tracking

- Tutorial completion stored in browser localStorage
- Course unlocking based on prerequisites
- Star-based reward system (10 stars per completed tutorial)
- Progress bar showing completion percentage
- Automatic resume functionality

## Development Guidelines

### Adding New Tutorials

1. Edit `lib/data.ts` to add tutorial data to the `tutorials` array
2. Set appropriate `courseId`, `order`, and `expectedOutput`
3. Use appropriate course types: `'canvas'`, `'printData'`, or `'iframe'`

### Adding New Courses

1. Add course definition in `lib/data.ts` in the `courses` array
2. Create corresponding tutorials for the course
3. Set `requiredCourse` for course dependencies
4. Update course selection page if needed

### Course Types

- **canvas**: Visual programming with drawing functions
- **printData**: Console output and data manipulation
- **iframe**: HTML preview with DOM manipulation

## Deployment

### Vercel (Recommended)

The project is configured for easy deployment on Vercel:

1. **Fork or clone the repository** to your GitHub account
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js configuration
3. **Deploy**: Click "Deploy" - no additional configuration needed!

### Environment Variables

The application works out of the box with no environment variables required. Optional settings:

```env
# Next.js Settings (Optional)
NODE_ENV=production
PORT=3000
```

### Traditional Hosting

1. Build the project: `npm run build`
2. Start the server: `npm start`
3. Ensure your hosting platform supports Node.js

## Troubleshooting

### Common Issues

1. **Port conflicts**: The dev server uses port 3020 by default
2. **Module not found**: Run `npm install` to ensure all dependencies are installed
3. **TypeScript errors**: Run `npm run check` to identify type issues
4. **AI features not working**: Users need to provide their own OpenAI API key
5. **Console not showing multiple lines**: Fixed in latest version with proper message handling

### Performance Optimization

- Code execution is debounced to prevent errors during typing
- Tutorial progress is cached in localStorage for instant loading
- Canvas operations are optimized for smooth visual feedback
- Iframe console messages are properly serialized for display

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please visit the GitHub repository or create an issue.

---

Built with ❤️ for young programmers learning JavaScript
