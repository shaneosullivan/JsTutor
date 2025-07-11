#!/usr/bin/env bun

/**
 * Build script to regenerate lib/data.ts from the courses folder structure
 * This runs at build time to create the data.ts file from markdown sources
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COURSES_DIR = path.join(__dirname, "../courses");
const OUTPUT_FILE = path.join(__dirname, "../config/data.ts");

interface LocalizedText {
  title: string;
  description: string;
}

interface Course {
  id: number;
  text: Record<string, LocalizedText>;
  type: string;
  order: number;
  requiredCourse: number | null;
}

interface TutorialText extends LocalizedText {
  content: string;
  expectedOutput?: string | null;
}

interface Tutorial {
  id: number;
  courseId: number;
  text: Record<string, TutorialText>;
  starterCode?: Record<string, string>;
  order: number;
}

function parseMarkdownFrontmatter(content: string): {
  frontmatter: any;
  body: string;
} {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const [, frontmatterStr, body] = match;
  const frontmatter: any = {};

  // Parse simple YAML-like frontmatter
  frontmatterStr.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Parse JSON values
      try {
        value = JSON.parse(value);
      } catch {
        // Keep as string if not valid JSON
      }

      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
}

function extractCodeFromMarkdown(content: string): string {
  const codeRegex = /```javascript\n([\s\S]*?)\n```/;
  const match = content.match(codeRegex);
  return match ? match[1] : "";
}

function buildDataFromCourses(): { courses: Course[]; tutorials: Tutorial[] } {
  const courses: Course[] = [];
  const tutorials: Tutorial[] = [];

  if (!fs.existsSync(COURSES_DIR)) {
    console.error(`Courses directory not found: ${COURSES_DIR}`);
    process.exit(1);
  }

  const courseFolders = fs
    .readdirSync(COURSES_DIR)
    .filter((item) => fs.statSync(path.join(COURSES_DIR, item)).isDirectory())
    .sort();

  for (const courseFolder of courseFolders) {
    const coursePath = path.join(COURSES_DIR, courseFolder);
    const courseJsonPath = path.join(coursePath, "course.json");

    if (!fs.existsSync(courseJsonPath)) {
      console.warn(`Skipping ${courseFolder}: no course.json found`);
      continue;
    }

    // Read course data
    const courseJsonData = JSON.parse(fs.readFileSync(courseJsonPath, "utf-8"));

    // Convert to localized structure
    const courseData: Course = {
      id: courseJsonData.id,
      text: {
        en: {
          title: courseJsonData.title,
          description: courseJsonData.description,
        },
      },
      type: courseJsonData.type,
      order: courseJsonData.order,
      requiredCourse: courseJsonData.requiredCourse,
    };

    courses.push(courseData);

    // console.log(`Processing course: ${courseData.text.en.title}`);

    // Read tutorials
    const tutorialFolders = fs
      .readdirSync(coursePath)
      .filter((item) => {
        const itemPath = path.join(coursePath, item);
        return fs.statSync(itemPath).isDirectory() && /^\d+$/.test(item);
      })
      .sort((a, b) => parseInt(a) - parseInt(b));

    for (const tutorialFolder of tutorialFolders) {
      const tutorialPath = path.join(coursePath, tutorialFolder);
      const enMdPath = path.join(tutorialPath, "en.md");
      const codeDir = path.join(tutorialPath, "code");
      const codeEnPath = path.join(codeDir, "en.md");

      if (!fs.existsSync(enMdPath)) {
        console.warn(`Skipping tutorial ${tutorialFolder}: no en.md found`);
        continue;
      }

      // Parse en.md
      const enContent = fs.readFileSync(enMdPath, "utf-8");
      const { frontmatter, body } = parseMarkdownFrontmatter(enContent);

      // Parse code/en.md if it exists
      const starterCode: Record<string, string> = {};
      if (fs.existsSync(codeEnPath)) {
        const codeContent = fs.readFileSync(codeEnPath, "utf-8");
        starterCode.en = extractCodeFromMarkdown(codeContent);
      }

      // Build localized text object (currently only English)
      const tutorialText: Record<string, TutorialText> = {
        en: {
          title: frontmatter.title || `Tutorial ${tutorialFolder}`,
          description: frontmatter.description || "",
          content: body.trim(),
          expectedOutput: frontmatter.expectedOutput || null,
        },
      };

      const tutorial: Tutorial = {
        id: frontmatter.id || parseInt(tutorialFolder),
        courseId: frontmatter.courseId || courseData.id,
        text: tutorialText,
        starterCode:
          Object.keys(starterCode).length > 0 ? starterCode : undefined,
        order: frontmatter.order || parseInt(tutorialFolder),
      };

      tutorials.push(tutorial);
      // console.log(
      //   `  Added tutorial: ${tutorial.id} - ${tutorial.text.en.title}`
      // );
    }
  }

  return { courses, tutorials };
}

function generateDataTsFile(courses: Course[], tutorials: Tutorial[]): string {
  const coursesJson = JSON.stringify(courses, null, 2);
  const tutorialsJson = JSON.stringify(tutorials, null, 2);

  return `// This file is auto-generated from the courses folder structure
// Do not edit directly - edit the source files in ./courses/ instead
// Run 'bun scripts/build-data.ts' to regenerate this file

export const rawCourses = ${coursesJson};

export const rawTutorials = ${tutorialsJson};
`;
}

// Main execution
const { courses, tutorials } = buildDataFromCourses();

// console.log(
//   `\nFound ${courses.length} courses and ${tutorials.length} tutorials`
// );

// Generate the TypeScript file
const dataFileContent = generateDataTsFile(courses, tutorials);

// Ensure the output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the file
fs.writeFileSync(OUTPUT_FILE, dataFileContent);
