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
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage with fallback to database
- **API Design**: RESTful endpoints for tutorials and user progress
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

1. **Tutorial Loading**: Frontend fetches tutorial list and user progress from backend
2. **Code Execution**: User writes JavaScript code in the editor
3. **Canvas Rendering**: Code executes in sandboxed environment with drawing API
4. **Progress Updates**: Completion status sent to backend and persisted
5. **Tutorial Unlocking**: Backend logic determines next available tutorials

## External Dependencies

### Frontend Dependencies
- **@radix-ui/react-***: Accessible UI primitives
- **@codemirror/**: Code editor functionality
- **@tanstack/react-query**: Server state management
- **codemirror**: Core editor functionality
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing

### Backend Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **tsx**: TypeScript execution runtime

### Development Dependencies
- **vite**: Build tool and development server
- **@replit/vite-plugin-***: Replit-specific development tools
- **esbuild**: JavaScript bundler for production builds

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: esbuild bundles Express server for production
3. **Database Migration**: Drizzle pushes schema changes to PostgreSQL
4. **Asset Optimization**: Vite optimizes CSS and JavaScript bundles

### Environment Configuration
- **Development**: Local development with hot reloading
- **Production**: Containerized deployment with environment variables
- **Database**: PostgreSQL with connection pooling via Neon

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

## User Preferences

Preferred communication style: Simple, everyday language.