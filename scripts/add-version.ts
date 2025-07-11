#!/usr/bin/env bun

/**
 * Script to add version: 1 to all .md files in the courses folder
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COURSES_DIR = path.join(__dirname, "../courses");

function addVersionToMarkdownFile(filePath: string): void {
  const content = fs.readFileSync(filePath, "utf-8");

  // Check if file has frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (match) {
    // File has frontmatter, check if version already exists
    const [, frontmatterStr, body] = match;

    if (frontmatterStr.includes("version:")) {
      // Remove existing version and add it to the end
      const lines = frontmatterStr.split("\n");
      const filteredLines = lines.filter(
        (line) => !line.trim().startsWith("version:"),
      );
      const newFrontmatter = `${filteredLines.join("\n")}\nversion: 1`;
      const newContent = `---\n${newFrontmatter}\n---\n${body}`;

      fs.writeFileSync(filePath, newContent);
      console.log(`Moved version to end in ${filePath}`);
      return;
    }

    // Add version to end of existing frontmatter
    const newFrontmatter = `${frontmatterStr}\nversion: 1`;
    const newContent = `---\n${newFrontmatter}\n---\n${body}`;

    fs.writeFileSync(filePath, newContent);
    console.log(`Added version to ${filePath}`);
  } else {
    // File has no frontmatter, create it
    const newContent = `---\nversion: 1\n---\n${content}`;

    fs.writeFileSync(filePath, newContent);
    console.log(`Created frontmatter with version for ${filePath}`);
  }
}

function processCoursesFolder(): void {
  if (!fs.existsSync(COURSES_DIR)) {
    console.error(`Courses directory not found: ${COURSES_DIR}`);
    process.exit(1);
  }

  let filesProcessed = 0;

  // Walk through all course folders
  const courseFolders = fs
    .readdirSync(COURSES_DIR)
    .filter((item) => fs.statSync(path.join(COURSES_DIR, item)).isDirectory())
    .sort();

  for (const courseFolder of courseFolders) {
    const coursePath = path.join(COURSES_DIR, courseFolder);
    console.log(`\nProcessing course: ${courseFolder}`);

    // Find all tutorial folders (numeric names)
    const tutorialFolders = fs
      .readdirSync(coursePath)
      .filter((item) => {
        const itemPath = path.join(coursePath, item);
        return fs.statSync(itemPath).isDirectory() && /^\d+$/.test(item);
      })
      .sort((a, b) => parseInt(a) - parseInt(b));

    for (const tutorialFolder of tutorialFolders) {
      const tutorialPath = path.join(coursePath, tutorialFolder);

      // Process en.md if it exists
      const enMdPath = path.join(tutorialPath, "en.md");
      if (fs.existsSync(enMdPath)) {
        addVersionToMarkdownFile(enMdPath);
        filesProcessed++;
      }

      // Process code/en.md if it exists
      const codeEnPath = path.join(tutorialPath, "code", "en.md");
      if (fs.existsSync(codeEnPath)) {
        addVersionToMarkdownFile(codeEnPath);
        filesProcessed++;
      }
    }
  }

  console.log(`\nProcessed ${filesProcessed} files`);
}

// Main execution
console.log("Adding version: 1 to all .md files in courses folder...");
processCoursesFolder();
console.log("Done!");
