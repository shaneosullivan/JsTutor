#!/usr/bin/env bun

/**
 * Build script to regenerate lib/data.ts from the courses folder structure
 * This runs at build time to create the data.ts file from markdown sources
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { LOCALES } from "../lib/locales";
import {
  generateCourseIdFromFolderName,
  parseMarkdownFrontmatter,
  extractCodeFromMarkdown,
  generateTutorialIdFromFolderName,
  updateFrontmatterOrder
} from "../lib/build-data-utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COURSES_DIR = path.join(__dirname, "../courses");
const OUTPUT_FILE = path.join(__dirname, "../config/data.ts");

interface LocalizedText {
  title: string;
  description: string;
}

interface Course {
  id: string;
  text: Record<string, LocalizedText>;
  type: string;
  order: number;
  requiredCourse: string | null;
}

interface TutorialText extends LocalizedText {
  content: string;
  expectedOutput?: string | null;
}

interface Tutorial {
  id: string;
  courseId: string;
  text: Record<string, TutorialText>;
  starterCode?: Record<string, string>;
  order: number;
}

function ensureLocaleFilesExist(
  coursePath: string,
  courseFolder: string
): void {
  // Get the base course data from en.json (should always exist)
  const enJsonPath = path.join(coursePath, "en.json");
  if (!fs.existsSync(enJsonPath)) {
    console.warn(
      `Warning: ${courseFolder} missing en.json - skipping locale file creation`
    );
    return;
  }

  const baseCourseData = JSON.parse(fs.readFileSync(enJsonPath, "utf-8"));

  // Ensure all locale files exist
  for (const locale of LOCALES) {
    const localeFilePath = path.join(coursePath, `${locale}.json`);

    if (!fs.existsSync(localeFilePath)) {
      if (locale === "en") {
        // en.json should always exist, but if not, create it with base structure
        fs.writeFileSync(
          localeFilePath,
          JSON.stringify(baseCourseData, null, 2)
        );
        console.log(`Created missing en.json for ${courseFolder}`);
      } else {
        // Copy en.json content for missing locale files (will be localized separately)
        fs.writeFileSync(
          localeFilePath,
          JSON.stringify(baseCourseData, null, 2)
        );
        console.log(
          `Created ${locale}.json by copying en.json for ${courseFolder}`
        );
      }
    }
  }
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

  // Create a mapping from old numeric IDs to new string IDs
  const courseIdMapping: Record<number, string> = {};

  // First pass: build the ID mapping
  for (const courseFolder of courseFolders) {
    const coursePath = path.join(COURSES_DIR, courseFolder);
    const enJsonPath = path.join(coursePath, "en.json");

    if (fs.existsSync(enJsonPath)) {
      const baseCourseData = JSON.parse(fs.readFileSync(enJsonPath, "utf-8"));
      const newCourseId = generateCourseIdFromFolderName(courseFolder);
      courseIdMapping[baseCourseData.id] = newCourseId;
    }
  }

  for (const courseFolder of courseFolders) {
    const coursePath = path.join(COURSES_DIR, courseFolder);

    // Ensure all locale files exist for this course
    ensureLocaleFilesExist(coursePath, courseFolder);

    // Find all JSON files (locale files) in the course folder
    const jsonFiles = fs
      .readdirSync(coursePath)
      .filter((file) => file.endsWith(".json") && file !== "package.json")
      .sort();

    if (jsonFiles.length === 0) {
      console.warn(`Skipping ${courseFolder}: no locale JSON files found`);
      continue;
    }

    // Read the English JSON file to get the base course structure (en.json should always have complete data)
    const enJsonPath = path.join(coursePath, "en.json");
    const baseCourseData = JSON.parse(fs.readFileSync(enJsonPath, "utf-8"));

    // Build the text object with all locales
    const text: Record<string, LocalizedText> = {};

    for (const jsonFile of jsonFiles) {
      const locale = path.basename(jsonFile, ".json"); // e.g., "en" from "en.json"
      const jsonPath = path.join(coursePath, jsonFile);
      const courseJsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

      // Only add locale to text if it has title and description (not empty)
      if (courseJsonData.title && courseJsonData.description) {
        text[locale] = {
          title: courseJsonData.title,
          description: courseJsonData.description
        };
      }
    }

    // Generate new string-based course ID
    const newCourseId = generateCourseIdFromFolderName(courseFolder);

    // Convert to localized structure
    const courseData: Course = {
      id: newCourseId,
      text,
      type: baseCourseData.type,
      order: baseCourseData.order,
      requiredCourse: baseCourseData.requiredCourse
        ? courseIdMapping[baseCourseData.requiredCourse] || null
        : null
    };

    courses.push(courseData);

    // console.log(`Processing course: ${courseData.text.en.title}`);

    // Read tutorials - now supporting both old numeric format (1, 2, 3) and new format (1 - Title)
    const tutorialFolders = fs
      .readdirSync(coursePath)
      .filter((item) => {
        const itemPath = path.join(coursePath, item);
        return (
          fs.statSync(itemPath).isDirectory() &&
          (/^\d+$/.test(item) || /^\d+\s*-\s*.+/.test(item))
        );
      })
      .sort((a, b) => {
        const numA = parseInt(a.match(/^\d+/)?.[0] || "0");
        const numB = parseInt(b.match(/^\d+/)?.[0] || "0");
        return numA - numB;
      });

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
          expectedOutput: frontmatter.expectedOutput || null
        }
      };

      // Extract order from folder name (this is the authoritative source)
      const folderNumber = parseInt(tutorialFolder.match(/^\d+/)?.[0] || "1");
      const tutorialOrder = folderNumber;

      // Generate tutorial ID based on folder name
      let tutorialId: string;

      if (/^\d+\s*-\s*.+/.test(tutorialFolder)) {
        // New format: "1 - Your First Variable" -> "your-first-variable"
        tutorialId = generateTutorialIdFromFolderName(tutorialFolder);
      } else {
        // Old format: just "1" - generate from title
        const title = frontmatter.title || `Tutorial ${tutorialFolder}`;
        tutorialId = generateTutorialIdFromFolderName(title);
      }

      // Update the frontmatter file if order or id has changed
      const expectedOrder = tutorialOrder;
      const expectedId = tutorialId;

      if (
        frontmatter.order !== expectedOrder ||
        frontmatter.id !== expectedId
      ) {
        const updatedContent = updateFrontmatterOrder(
          enContent,
          expectedOrder,
          expectedId
        );
        fs.writeFileSync(enMdPath, updatedContent, "utf-8");
        console.log(
          `Updated frontmatter for ${tutorialFolder}: order=${expectedOrder}, id="${expectedId}"`
        );
      }

      const tutorial: Tutorial = {
        id: tutorialId,
        courseId: newCourseId,
        text: tutorialText,
        starterCode:
          Object.keys(starterCode).length > 0 ? starterCode : undefined,
        order: tutorialOrder
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
