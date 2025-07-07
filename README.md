# JavaScript Adventure 🚀

An interactive JavaScript learning platform designed for children, featuring hands-on tutorials, visual programming with canvas, AI-powered assistance, and progressive skill building across multiple specialized courses.

## Features

- **Interactive Learning Environment**: Visual code editor with real-time execution
- **5 Specialized Courses**: Basics (canvas), Array Methods (data output), DOM Manipulation (iframe), Algorithms (logic), and Remote Data (API integration)
- **AI-Powered Assistance**: OpenAI integration for personalized coding help
- **Visual Programming**: Canvas-based drawing API for immediate visual feedback
- **Progressive Unlocking**: Structured learning path with tutorial dependencies
- **Persistent Progress**: LocalStorage-based progress tracking across sessions
- **Responsive Design**: Optimized for young learners with child-friendly interface

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js + TypeScript
- **Code Editor**: CodeMirror 6 with JavaScript syntax highlighting
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for client-side navigation
- **AI Integration**: OpenAI GPT-4o for coding assistance

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher

That's it! No API keys or database setup required.

## Environment Variables

The application works out of the box with no environment variables required. You can optionally create a `.env` file for custom settings:

```env
# Application Settings (Optional)
NODE_ENV=development
PORT=5000
```

### AI Integration

The platform includes AI-powered coding assistance. Users provide their own OpenAI API keys directly through the application interface when they want to use AI features. No server-side API key configuration needed.

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
   - Navigate to `http://localhost:5000` in your browser
   - The application serves both frontend and backend on the same port

## Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build frontend and backend for production
npm start           # Start production server

# No database setup required - uses in-memory storage and localStorage

# Code Quality
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript type checking
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and API client
│   │   └── App.tsx        # Main application component
│   └── index.html         # HTML template
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite integration
├── shared/                # Shared TypeScript definitions
│   └── schema.ts         # Data models and validation
└── README.md             # This file
```

## Key Features Explained

### Course Structure

1. **Basics Course** (Canvas-based): Fundamental programming concepts with visual output
2. **Array Methods Course** (PrintData): Working with arrays and data manipulation
3. **DOM Manipulation Course** (iframe): Building interactive web pages
4. **Algorithms Course** (PrintData): Logic, recursion, and problem-solving
5. **Remote Data Course** (API integration): Fetching and working with external data

### AI Integration

- Users can provide their own OpenAI API keys for personalized assistance
- AI provides contextual help based on current code and errors
- Child-friendly explanations and guidance
- Automatic error detection and debugging suggestions

### Progress Tracking

- Tutorial completion stored in browser localStorage
- Course unlocking based on prerequisites
- Automatic resume functionality - returns users to last visited course
- Star-based reward system for completed tutorials

## Development Guidelines

### Adding New Tutorials

1. Edit `server/storage.ts` to add tutorial data to the `initializeTutorials()` method
2. Tutorials are automatically ordered and unlocked based on completion
3. Use appropriate course types: 'canvas', 'printData', or 'iframe'

### Adding New Courses

1. Add course definition in `server/storage.ts` in the `initializeCourses()` method
2. Create corresponding tutorials for the course
3. Set `requiredCourse` for course dependencies

### Canvas API Functions

The platform provides a rich set of drawing functions for visual programming:

```javascript
// Basic drawing
drawPixel(x, y, color)
drawCircle(x, y, radius, color)
drawLine(x1, y1, x2, y2, color)
drawRect(x, y, width, height, color)
drawText(x, y, text, color)

// Canvas management
clearCanvas()

// Event handling
onKeyPress(callback)
onArrowKeys(callback)
onSpaceBar(callback)
isKeyPressed(key)
```

## Deployment

### Replit Deployment
This project is optimized for Replit deployment with built-in environment variable management.

### Traditional Hosting
1. Build the project: `npm run build`
2. Set environment variables on your hosting platform
3. Start the server: `npm start`
4. Ensure port 5000 is accessible (or set custom PORT environment variable)

### Storage
The application uses:
- **In-memory storage** for course and tutorial data (resets on server restart)
- **localStorage** for user progress and tutorial completion (persists in browser)
- No database setup required

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change the PORT environment variable if 5000 is in use
2. **Module not found**: Run `npm install` to ensure all dependencies are installed
3. **TypeScript errors**: Run `npm run type-check` to identify type issues
4. **AI features not working**: Users need to provide their own OpenAI API key through the application interface

### Performance Optimization

- The application uses debounced code execution (500ms) to prevent errors during typing
- Tutorial progress is cached in localStorage for instant loading
- Canvas operations are optimized for smooth visual feedback

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please visit the GitHub repository or create an issue.

---

Built with ❤️ for young programmers learning JavaScript