# JsTutor 🚀

An interactive JavaScript learning platform featuring hands-on tutorials, visual programming with canvas, and progressive skill building across multiple specialized courses. Designed for learners of all ages to master JavaScript fundamentals through practice and real-time feedback.

## Features

- **Interactive Learning Environment**: Visual code editor with real-time execution and error highlighting
- **7 Specialized Courses**:
  - **Basics** (Canvas): Visual programming with drawing functions - 14 interactive tutorials
  - **Array Methods** (PrintData): Data manipulation and array operations - 4 tutorials  
  - **DOM Manipulation** (iframe): Interactive web pages and HTML elements - 5 tutorials
  - **Algorithms** (PrintData): Logic, recursion, and problem-solving - 5 tutorials
  - **Remote Data** (PrintData): API integration and data fetching - 5 tutorials
  - **Modern JavaScript** (PrintData): ES6+ features, async/await, promises - 9 tutorials
  - **TypeScript** (PrintData): Type safety, interfaces, generics - 7 tutorials
- **Profile Management**: Google OAuth integration for progress sync across devices
- **Visual Programming**: Canvas-based drawing API with keyboard event handling
- **Progressive Unlocking**: Structured learning path with tutorial dependencies
- **Persistent Progress**: LocalStorage-based progress tracking across sessions
- **Responsive Design**: Optimized for young learners with child-friendly interface
- **Console Output**: Real-time console logging with smart object serialization
- **Help System**: Comprehensive function reference with examples

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Code Editor**: CodeMirror 6 with JavaScript syntax highlighting and error detection
- **State Management**: TinyBase for reactive state management with localStorage persistence
- **Authentication**: Google OAuth with Firebase Admin integration
- **Deployment**: Vercel with custom domain (jstutor.chofter.com)
- **Canvas API**: Custom drawing functions for visual programming
- **Build Tool**: Next.js built-in bundler

## Prerequisites

- **Node.js**: Version 18 or higher  
- **Bun**: Version 1.2+ (used as package manager and test runner)

That's it! The application uses build-time data generation and client-side state management.

## Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shaneosullivan/JsTutor.git
   cd JsTutor
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Build the data**:

   ```bash
   bun scripts/build-data.ts
   ```

4. **Start the development server**:

   ```bash
   bun run dev
   ```

5. **Open the application**:
   - Navigate to `http://localhost:3020` in your browser

## Available Scripts

```bash
# Development
bun run dev          # Start Next.js development server (port 3020)

# Production
bun run build        # Build data, generate buildId, and build for production
bun start           # Start production server

# Development Tools
bun run check       # Run TypeScript type checking
bun run format      # Format code with Prettier
bun run generate-icons # Generate app icons

# Data Management  
bun scripts/build-data.ts # Generate course data from markdown files
bun test            # Run unit tests with Bun
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── course/[id]/       # Individual course pages
│   ├── profiles/          # Profile management pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with SEO and metadata
│   └── page.tsx           # Home page (course selection)
├── components/            # React components
│   ├── pages/             # Page components
│   ├── ui/                # shadcn/ui components
│   ├── code-editor.tsx    # CodeMirror editor with formatting and resize handling
│   ├── drawing-canvas.tsx # Canvas rendering component  
│   ├── iframe-display.tsx # HTML preview component
│   ├── tutorial-sidebar.tsx # Tutorial navigation component
│   └── tutorial-content.tsx # Main tutorial interface
├── hooks/                 # Custom React hooks
├── courses/               # Course content in markdown format
│   ├── 1 - Basics/        # Individual tutorial folders with en.md files
│   ├── 2 - Array Methods/ # Course content and starter code
│   └── ...                # Other courses
├── lib/                   # Utility functions and data  
│   ├── build-data-utils.ts # Utilities for processing course markdown
│   ├── canvas-api.ts      # Canvas drawing functions
│   ├── profile-storage.ts # TinyBase profile and progress management
│   └── debounce.ts        # Utility functions
├── scripts/               # Build and utility scripts
│   └── build-data.ts      # Generates config/data.ts from markdown
├── tests/                 # Unit tests
│   └── build-data-utils.test.ts # Tests for data processing utilities
├── shared/                # Shared TypeScript definitions
│   └── schema.ts          # Data models and validation
└── public/                # Static assets
```

## Course Structure

### 1. Basics Course (Canvas-based) - 14 Tutorials

Visual programming fundamentals with drawing and interaction:
- **Your First Variable**: Learn to store and use information  
- **Draw A Happy Face**: Mathematical operations and drawing shapes
- **Shortcuts with Math**: Mathematical shortcuts and calculations
- **Simple Repeating**: Introduction to loops and repetition
- **Advanced Repeating**: More complex loop patterns
- **Making Decisions**: Conditional logic and if statements
- **Listening to Keys**: Keyboard event handling and user input
- **Colors and Shapes**: Color theory and shape drawing
- **Making Patterns**: Creating visual patterns with code
- **Random Fun**: Working with random numbers and unpredictability
- **Moving Things**: Animation and object movement
- **Spacebar Magic**: Advanced keyboard interactions
- **Snake Game**: Complete game implementation
- **Your Own Game**: Capstone project

### 2. Array Methods Course (PrintData) - 4 Tutorials

Data manipulation and functional programming:
- **forEach - Do Something with Each Item**: Basic array iteration
- **map - Transform Each Item**: Data transformation techniques  
- **filter - Keep Only Some Items**: Data filtering and selection
- **reduce - Combine All Items**: Advanced data aggregation

### 3. DOM Manipulation Course (iframe) - 5 Tutorials

Interactive web pages and HTML element manipulation:
- **What is HTML?**: HTML structure, head/body, tags, attributes
- **Finding Elements**: getElementById, querySelector, querySelectorAll
- **Changing Styles**: CSS property manipulation and classes
- **Creating New Elements**: Dynamic content creation
- **Working with Forms**: User input handling and validation

### 4. Algorithms Course (PrintData) - 5 Tutorials

Logic, problem-solving, and algorithmic thinking:
- **What Are Algorithms?**: Introduction to computational thinking
- **Searching Algorithms**: Finding data efficiently
- **Sorting Algorithms**: Organizing data systematically  
- **Introduction to Recursion**: Self-referential problem solving
- **Problem Solving Strategies**: Systematic approach to coding challenges

### 5. Remote Data Course (PrintData) - 5 Tutorials

API integration and data fetching:
- **What is Remote Data?**: Understanding APIs and data sources
- **GET Requests**: Fetching data from servers
- **POST Requests**: Sending data to servers
- **Error Handling**: Robust error management strategies
- **Real-World API Integration**: Complete API workflow

### 6. Modern JavaScript Course (PrintData) - 9 Tutorials

ES6+ features and modern JavaScript patterns:
- **Let and Const - Better Ways to Store Things**: Modern variable declarations
- **Template Literals - Super Cool String Powers**: String interpolation and formatting
- **Arrow Functions - The Cool New Way to Write Functions**: Concise function syntax
- **Promises - Making Promises to Do Things Later**: Asynchronous programming basics
- **Async Await - Making Promises Even Easier!**: Simplified async code
- **Fetch API - Getting Data from the Internet**: Modern HTTP requests
- **Functional Programming Basics - Thinking in Functions**: Functional programming concepts
- **Higher-Order Functions - Functions That Use Other Functions**: Advanced function patterns
- **Closures - Functions That Remember Things**: Scope and closure concepts

### 7. TypeScript Course (PrintData) - 7 Tutorials

Type safety and advanced JavaScript development:
- **What is TypeScript? - JavaScript with Superpowers!**: TypeScript introduction
- **Basic Types - Teaching JavaScript About Different Kinds of Data**: Type annotations
- **Function Types - Teaching Functions About Their Jobs**: Function type definitions
- **Object Types - Describing Things with Properties**: Object type safety
- **Interfaces - Creating Blueprints for Objects**: Interface definitions
- **Union Types - When Something Can Be Multiple Types**: Flexible type definitions
- **Generics - Creating Flexible, Reusable Code**: Generic programming

## Key Features Explained

### Profile Management & Progress Sync

- Google OAuth authentication for secure user management
- Cross-device progress synchronization via Firebase
- Multiple profile support for shared devices
- Automatic progress backup and restoration
- Course completion tracking with persistent state

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

### Progress Tracking & Data Management

- Tutorial completion stored in TinyBase reactive state system
- Course unlocking based on prerequisites (Basics required first)
- Real-time progress synchronization across browser sessions
- Automatic build-time data generation from markdown content
- Version tracking for content updates with frontmatter management
- Comprehensive test coverage for data processing utilities

## Development Guidelines

### Adding New Tutorials

1. **Create markdown files**: Add tutorial content in `courses/[course-name]/[order] - [title]/en.md`
2. **Add starter code**: Optionally include `code/en.md` for initial code examples
3. **Run build script**: Execute `bun scripts/build-data.ts` to generate `config/data.ts`
4. **Test changes**: Verify tutorial appears correctly in the application

### Adding New Courses

1. **Create course directory**: Add new folder in `courses/` with format `[order] - [Course Name]/`
2. **Add course metadata**: Include `en.json` with course title, description, and type
3. **Create tutorials**: Add numbered tutorial folders with markdown content
4. **Update dependencies**: Set `requiredCourse` in course JSON for prerequisites
5. **Rebuild data**: Run build script to update application data

### Content Management

- **Frontmatter sync**: Build script automatically updates tutorial IDs, order, and titles
- **Version tracking**: Content changes increment version numbers in frontmatter  
- **Test coverage**: Run `bun test` to verify data processing utilities
- **String-based IDs**: Tutorials use stable string IDs generated from folder names

### Course Types

- **canvas**: Visual programming with drawing functions
- **printData**: Console output and data manipulation
- **iframe**: HTML preview with DOM manipulation

## Deployment

The application is deployed at **[jstutor.chofter.com](https://jstutor.chofter.com)** using Vercel with custom domain.

### Vercel Deployment

The project is optimized for Vercel deployment:

1. **Fork or clone the repository** to your GitHub account
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js configuration
3. **Configure environment**: Add `GOOGLE_CLIENT_ID` for OAuth functionality
4. **Deploy**: Automatic builds on push with custom domain support

### Environment Variables

Required for full functionality:

```env
# Google OAuth (Required for profile sync)
GOOGLE_CLIENT_ID=your_google_client_id_here

# Next.js Settings (Optional)
NODE_ENV=production
PORT=3000
```

### Traditional Hosting

1. Build the project: `bun run build`
2. Start the server: `bun start`
3. Ensure your hosting platform supports Node.js

## Troubleshooting

### Common Issues

1. **Port conflicts**: The dev server uses port 3020 by default
2. **Module not found**: Run `bun install` to ensure all dependencies are installed
3. **TypeScript errors**: Run `bun run check` to identify type issues
4. **Data not loading**: Run `bun scripts/build-data.ts` to generate course data
5. **Profile sync not working**: Verify `GOOGLE_CLIENT_ID` environment variable is set
6. **Build failures**: Ensure all markdown frontmatter is properly formatted

### Performance Optimization

- Code execution is debounced to prevent errors during typing
- Tutorial progress managed by TinyBase for reactive updates
- Canvas operations are optimized for smooth visual feedback
- Iframe console messages are properly serialized for display
- Build-time data generation reduces runtime processing
- Automatic code formatting with debounced window resize handling

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

**Live Site**: [jstutor.chofter.com](https://jstutor.chofter.com)

Built with ❤️ for JavaScript learners of all ages
