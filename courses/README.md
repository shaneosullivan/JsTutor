# Course Authoring System

This folder contains the course and tutorial content in a structured, editable format that makes it easy to author and maintain educational content.

## Folder Structure

```
courses/
├── 1 - Basics/                    # Course folder (ID - Name)
│   ├── en.json                    # Course metadata (English)
│   ├── es.json                    # Course metadata (Spanish) - optional
│   ├── 1/                         # Tutorial folder (tutorial ID)
│   │   ├── en.md                  # Tutorial content in English
│   │   └── code/                  # Starter code folder
│   │       └── en.md              # Starter code in English
│   ├── 2/
│   │   ├── en.md
│   │   └── code/
│   │       └── en.md
│   └── ...
├── 2 - Array Methods/
│   ├── en.json                    # Course metadata (English)
│   ├── 16/
│   │   ├── en.md
│   │   └── code/
│   │       └── en.md
│   └── ...
└── README.md                      # This file
```

## File Formats

### en.json (Course Metadata)
Contains course metadata in English:
```json
{
  "id": 1,
  "title": "Basics",
  "description": "Learn the fundamentals of JavaScript programming with visual drawing",
  "type": "canvas",
  "order": 1,
  "requiredCourse": null
}
```

For additional languages, create `es.json`, `fr.json`, etc. with the same structure but translated text:
```json
{
  "id": 1,
  "title": "Básicos",
  "description": "Aprende los fundamentos de la programación JavaScript con dibujo visual",
  "type": "canvas",
  "order": 1,
  "requiredCourse": null
}
```

### en.md (Tutorial Content)
Contains frontmatter and content:
```markdown
---
id: 1
courseId: 1
title: "Your First Variable"
description: "Learn to store information"
expectedOutput: "A blue circle and your name displayed"
order: 1
---

## What are Variables?

Variables are like **boxes** that hold information...
```

### code/en.md (Starter Code)
Contains the initial code for the tutorial in English:
```markdown
\`\`\`javascript
// Let's create our first variable!
let myName = "Your Name";
let age = 9;

drawCircle(200, 200, age * 5, 'blue');
drawText(200, 300, myName, 'black');
\`\`\`
```

## Localization Support

The structure supports multiple languages:

### Multiple Languages
- Content: `en.md`, `es.md`, `fr.md`, etc.
- Code: `code/en.md`, `code/es.md`, `code/fr.md`, etc.
- Courses: Multiple locale files (`en.json`, `es.json`, etc.) per course

### Generated Course Structure
The build process automatically combines all locale files into a single structure:
```json
{
  "id": 1,
  "type": "canvas", 
  "order": 1,
  "requiredCourse": null,
  "text": {
    "en": {
      "title": "Basics",
      "description": "Learn the fundamentals of JavaScript programming with visual drawing"
    },
    "es": {
      "title": "Básicos", 
      "description": "Aprende los fundamentos de la programación JavaScript con dibujo visual"
    }
  }
}
```

This structure is created by reading all `.json` files in each course folder (e.g., `en.json`, `es.json`) and merging them into the `text` object with locale keys.

### Generated Data Structure
The build process creates a clean, localized data structure:

#### Generated Files
- **`lib/data.ts`** - Auto-generated data file (contains only data + imports)
- **`lib/data-utils.ts`** - Manual utility functions and types (never regenerated)

#### Data Structure
- `rawCourses` and `rawTutorials` contain the full localized data
- `courses` and `tutorials` contain the current locale (hardcoded to 'en')
- Helper functions support optional locale parameters
- Backward compatibility maintained for existing code
- All logic separated from auto-generated data

## Build Process

The content in this folder is automatically converted to TypeScript at build time:

1. **Development**: Edit the markdown files directly
2. **Build**: Run `bun scripts/build-data.ts` to regenerate `lib/data.ts`
3. **Automatic**: The build process (`npm run build`) automatically runs the data generation

## Editing Workflow

1. **Edit content**: Modify the `.md` files in the course folders
2. **Test locally**: Run `bun scripts/build-data.ts && npm run dev`
3. **Build**: Run `npm run build` (automatically generates data.ts)

## Adding New Content

### New Tutorial
1. Create a new folder with the tutorial ID number
2. Add `en.md` with frontmatter and content
3. Add `code.md` with starter code (optional)

### New Course
1. Create a new folder named `{id} - {title}`
2. Add `course.json` with course metadata
3. Add tutorial folders as needed

## Benefits

- **Version Control**: All content is in plain text files
- **Collaboration**: Easy to review changes in Git
- **Internationalization**: Ready for multiple languages (en.md, es.md, etc.)
- **Separation**: Content separated from code
- **Build-time Generation**: No runtime parsing overhead
- **Type Safety**: Generated TypeScript ensures consistency