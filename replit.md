# JavaScript Adventure - Learn Programming Through Interactive Tutorials

## Overview

JavaScript Adventure is an interactive educational platform designed to teach JavaScript programming through hands-on tutorials. The application features a visual code editor with a drawing canvas, allowing users to see immediate results of their code execution. Built with React and Express, it provides a gamified learning experience with progress tracking and a tutorial progression system.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom theming
- **State Management**: TanStack Query for server state, React hooks for local state
- **Code Editor**: CodeMirror 6 with JavaScript syntax highlighting and dark theme
- **Routing**: Wouter for client-side navigation

### Backend Architecture

- **Framework**: Express.js with TypeScript
- **Storage**: In-memory storage for course/tutorial data
- **Session Management**: Local storage for user progress
- **API Design**: RESTful endpoints for course data and Remote Data course examples
- **Development**: Hot module replacement via Vite integration

### Key Components

#### Tutorial System

- **Tutorial Content**: Rich text descriptions with starter code and expected outputs
- **Progress Tracking**: User completion status and star-based reward system
- **Unlocking Mechanism**: Sequential tutorial unlocking based on completion
- **Code Execution**: Safe JavaScript execution with canvas drawing API

#### Drawing Canvas

- **Canvas API**: Custom drawing functions (drawCircle, drawLine, drawRect, etc.)
- **Real-time Feedback**: Immediate visual output from code execution
- **Error Handling**: User-friendly error messages and debugging tips

#### User Interface

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Elements**: Code editor with syntax highlighting and autocomplete
- **Help System**: Contextual help modal with tips and troubleshooting
- **Progress Visualization**: Progress bars and completion indicators

## Data Flow

1. **Course Loading**: Frontend fetches course and tutorial data from in-memory backend storage
2. **Code Execution**: User writes JavaScript code in the editor
3. **Visual Rendering**: Code executes with course-specific interfaces (canvas, printData, iframe)
4. **Progress Updates**: Completion status stored locally in browser localStorage
5. **Course Unlocking**: Client-side logic determines available courses and tutorials

## External Dependencies

### Frontend Dependencies

- **@radix-ui/react-\***: Accessible UI primitives
- **@codemirror/**: Code editor functionality
- **@tanstack/react-query**: Server state management
- **codemirror**: Core editor functionality
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing

### Backend Dependencies

- **express**: Web application framework
- **tsx**: TypeScript execution runtime

### Development Dependencies

- **vite**: Build tool and development server
- **@replit/vite-plugin-\***: Replit-specific development tools
- **esbuild**: JavaScript bundler for production builds

## Deployment Strategy

### Build Process

1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: esbuild bundles Express server for production
3. **Asset Optimization**: Vite optimizes CSS and JavaScript bundles

### Environment Configuration

- **Development**: Local development with hot reloading
- **Production**: Containerized deployment with environment variables
- **Storage**: Client-side localStorage for user progress

### Performance Considerations

- **Code Splitting**: Vite automatically splits bundles for optimal loading
- **Caching**: TanStack Query provides intelligent caching for API responses
- **Error Boundaries**: React error boundaries prevent full application crashes

## Changelog

Changelog:

- July 07, 2025: Initial setup
- July 07, 2025: Added comprehensive API documentation with tabbed interface
  - Created dedicated reference section with all drawing functions
  - Added color examples and hex code support
  - Included practical code examples for common patterns
  - Integrated as "Reference" tab alongside tutorial content
- July 07, 2025: Enhanced tutorial progression and user experience
  - Added detailed educational explanations for all drawing functions
  - Implemented collapsible "What You'll Learn" section
  - Auto-expands explanations when opening tutorials for first time
  - Removed confusing Run Code button, added automatic execution
  - Fixed progression system with manual completion and advancement
  - Added "Mark Complete & Continue" and "Next Lesson" buttons
- July 07, 2025: Implemented user-provided OpenAI API key system
  - Replaced server-side API key with user-provided keys stored in localStorage
  - Added child-friendly API key setup process with parent guidance
  - Implemented API key validation before saving
  - Created encouraging, upbeat interface explaining the benefits of AI assistance
  - AI assistant now uses user's own OpenAI credits for personalized help
- July 07, 2025: Enhanced AI chat experience and fixed scrolling issues
  - Fixed AI chat container scrolling to prevent code editor from being pushed off-screen
  - Added proper overflow handling and flex constraints for chat messages
  - Updated AI instructions to be brief (2-3 sentences max) for children's attention spans
  - AI now always receives complete current code with every message for better context
  - AI explicitly instructed to use provided utility functions instead of suggesting rewrites
  - Fixed AI chat state persistence - conversation now maintained when switching between canvas and chat views
  - AI chat only resets when switching to a different tutorial, preserving conversation within same lesson
  - Added automatic error detection - AI assistant automatically offers help when canvas has errors
  - AI chat only sends initial message when first shown, not when mounted in background
  - Error messages are automatically sent to AI with code context for immediate debugging help
  - Fixed AI chat layout to use proper flex constraints preventing overflow and scrolling issues
  - Chat input always stays visible at bottom with messages scrolling independently in dedicated area
  - Made "Help Me" button more playful with gradient colors, emojis, and hover animations for child appeal
  - Button features purple-to-pink gradient with scaling animation and robot emoji for fun factor
  - Fixed AI chat context persistence - now only resets conversation when changing tutorials, not when hiding/showing chat
  - AI chat replaces only canvas area while keeping code editor visible and usable during conversations
- July 07, 2025: Fixed setInterval/setTimeout cleanup system to prevent persistent timers
  - Added automatic cleanup of all intervals and timeouts when code changes or tutorials switch
  - Wrapped setInterval and setTimeout to track all timer IDs for proper cleanup
  - Fixed bug where animations would continue running when switching tutorials
- July 07, 2025: Added keyboard event system and Snake game tutorials
  - Added onKeyPress, onArrowKeys, onSpaceBar, and isKeyPressed utility functions
  - Created "Listening to Keys" tutorial for basic keyboard interaction
  - Created "Spacebar Magic" tutorial for special key actions
  - Built complete Snake game tutorial with arrow key controls and spacebar restart
  - Added "Your Own Game!" as final creative challenge tutorial
  - Enhanced canvas API with comprehensive keyboard event handling
- July 07, 2025: Implemented local storage for user progress and collapsible sidebar
  - Added localStorage persistence for completed tutorials and user code per tutorial
  - Code automatically saves as user types and loads when switching between tutorials
  - Progress persists across page refreshes without server dependency
  - Created collapsible left sidebar that can be minimized to show only tutorial numbers
  - In collapsed state, sidebar shows progress indicators and current tutorial markers
  - Improved user experience with persistent progress and better space utilization
  - Updated tutorial layout with horizontally collapsible "What You'll Learn" panel
  - Arranged code editor and canvas side-by-side for better screen space utilization
  - Enhanced workspace layout for improved coding and visual feedback experience
- July 07, 2025: Implemented error line highlighting and enhanced AI debugging assistance
  - Added line number detection for JavaScript errors in code execution
  - Code editor now highlights error lines with red background and left border indicator
  - Error messages display specific line numbers where problems occur
  - AI assistant instructed to always mention line numbers when discussing code issues
  - Enhanced error parsing to extract line numbers from JavaScript stack traces
  - Improved debugging experience with visual error indicators and precise AI guidance
- July 07, 2025: Removed PostgreSQL database dependency and simplified architecture
  - Eliminated unnecessary PostgreSQL database as all data is stored client-side
  - Removed Drizzle ORM, database tables, and related dependencies
  - Simplified schema to pure TypeScript interfaces with Zod validation
  - Course and tutorial data now served from in-memory storage only
  - User progress maintained entirely in localStorage for better performance
  - Cleaner, simpler architecture focused on client-side educational experience
- July 07, 2025: Enhanced tutorial progression with comprehensive Snake game build-up
  - Added intermediate tutorials building from basic concepts to complete game
  - "Colors and Shapes" tutorial teaches visual design and hex colors
  - "Making Patterns" tutorial introduces advanced loop concepts with visual patterns
  - "Random Fun" tutorial adds excitement with Math.random() for scattered elements
  - "Moving Things" tutorial teaches animation with setInterval and bouncing balls
  - "Spacebar Magic" tutorial adds special key actions and trail effects
  - Complete progression from variables through Snake game to creative final project
  - Each tutorial builds on previous concepts while introducing new programming skills
  - "What You'll Learn" section now auto-expands when switching tutorials for immediate educational context
- July 07, 2025: Added compound assignment operators tutorial and improved loop progression
  - Created "Shortcuts with Math" tutorial after "Maths is Fun!" covering +=, -=, \*=, /=
  - Demonstrates practical usage with visual examples showing score tracking and size changes
  - Teaches programming efficiency and industry-standard coding practices
  - Restructured loop learning progression: while loops first (simpler), then for loops (advanced)
  - "Simple Repeating" tutorial introduces while loops with clear counter examples
  - "Advanced Repeating" tutorial teaches for loops and compares them to while loops
  - Updated all subsequent tutorial order numbers to maintain proper sequence
  - Now 15 total tutorials in Basics course with comprehensive programming foundation
- July 07, 2025: Fixed setInterval/setTimeout cleanup system to prevent persistent timers
  - Added automatic cleanup of all intervals and timeouts when code changes or tutorials switch
  - Enhanced canvas API to track and clean up DOM event listeners (onKeyPress, onArrowKeys, onSpaceBar)
  - Fixed bug where keyboard events from previous tutorials would interfere with new ones
  - Updated both DrawingCanvas and PrintDataDisplay components with comprehensive cleanup
  - Wrapped setInterval and setTimeout to track all timer IDs for proper cleanup
  - Added cleanup tracking for all event listeners to prevent memory leaks and interference
  - Ensured tutorials are fully isolated - no timers or events persist between tutorial switches
- July 07, 2025: Implemented debounced code execution and improved Console Output layout
  - Added 500ms debounce delay to prevent errors while user is typing
  - Code execution now waits for user to stop typing before running
  - Console Output and code editor now have equal width (1/2 each) for balanced layout
  - Removed centering constraints that were limiting printData display components
  - Reduced false error reports during active typing sessions
- July 07, 2025: Implemented automatic course resume functionality
  - Users automatically return to their last visited course when refreshing or reopening the app
  - Course selection screen tracks last visited course in localStorage
  - Basics course (course 1) remains on home route, other courses use /course/:id
  - Seamless user experience with persistent course state across sessions
- July 07, 2025: Added comprehensive documentation for external deployment
  - Created detailed README.md with setup instructions for running outside Replit
  - Added .env.example template with all required and optional environment variables
  - Documented tech stack, project structure, and development guidelines
  - Included troubleshooting section and deployment strategies
- July 07, 2025: Fixed Vercel deployment configuration and module resolution
  - Added proper ES module imports with .js extensions for Node.js compatibility
  - Created vercel.json with correct serverless function configuration
  - Added @vercel/node package for proper TypeScript support
  - Resolved toaster component build issues and path resolution conflicts
  - Updated server architecture to export Express app for Vercel serverless functions
  - Fixed production environment detection and static file serving

## User Preferences

Preferred communication style: Simple, everyday language.
