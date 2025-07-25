/**
 * Shared utility functions for build-data operations
 * These functions handle string manipulation, markdown parsing, and frontmatter updates
 */

export function generateCourseIdFromFolderName(folderName: string): string {
  // Remove number prefix and convert to lowercase
  // "1 - Basics" -> "basics"
  // "2 - Array Methods" -> "array-methods"
  return folderName
    .replace(/^\d+\s*-\s*/, "") // Remove number and dash prefix
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ""); // Remove any other special characters
}

export function parseMarkdownFrontmatter(content: string): {
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

export function extractCodeFromMarkdown(content: string): string {
  const codeRegex = /```javascript\n([\s\S]*?)\n```/;
  const match = content.match(codeRegex);
  return match ? match[1] : "";
}

export function generateTutorialIdFromFolderName(folderName: string): string {
  // Convert "1 - Your First Variable" -> "your-first-variable" (remove number prefix)
  return folderName
    .replace(/^\d+\s*-\s*/, "") // Remove number prefix and dash
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters first, keep spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

export function extractTitleFromFolderName(folderName: string): string {
  // Extract title from folder name like "1 - Your First Variable" -> "Your First Variable"
  if (/^\d+\s*-\s*.+/.test(folderName)) {
    return folderName.replace(/^\d+\s*-\s*/, "").trim();
  }

  // If no dash format, return the folder name as-is (handles old numeric format)
  return folderName;
}

export function updateFrontmatterOrder(
  content: string,
  newOrder: number,
  newId: string,
  newTitle?: string,
  incrementVersion?: boolean
): string {
  // Handle the special case of completely empty frontmatter (---\n---\n)
  if (/^---\n---\n/.test(content)) {
    const body = content.replace(/^---\n---\n/, "");
    let frontmatterContent = `id: "${newId}"\norder: ${newOrder}`;
    if (newTitle) {
      frontmatterContent += `\ntitle: "${newTitle}"`;
    }
    if (incrementVersion) {
      frontmatterContent += `\nversion: 1`;
    }
    return `---\n${frontmatterContent}\n---\n${body}`;
  }

  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return content;
  }

  const [, frontmatterStr, body] = match;

  // Update the frontmatter
  let updatedFrontmatter = frontmatterStr;

  // Replace or add id field
  if (/^id:\s*.*$/m.test(updatedFrontmatter)) {
    updatedFrontmatter = updatedFrontmatter.replace(
      /^id:\s*.*$/m,
      `id: "${newId}"`
    );
  } else {
    updatedFrontmatter =
      updatedFrontmatter.trim() +
      (updatedFrontmatter.trim() ? "\n" : "") +
      `id: "${newId}"`;
  }

  // Replace or add order field
  if (/^order:\s*\d+/m.test(updatedFrontmatter)) {
    updatedFrontmatter = updatedFrontmatter.replace(
      /^order:\s*\d+/m,
      `order: ${newOrder}`
    );
  } else {
    updatedFrontmatter =
      updatedFrontmatter.trim() +
      (updatedFrontmatter.trim() ? "\n" : "") +
      `order: ${newOrder}`;
  }

  // Replace or add title field if provided
  if (newTitle) {
    if (/^title:\s*.*$/m.test(updatedFrontmatter)) {
      updatedFrontmatter = updatedFrontmatter.replace(
        /^title:\s*.*$/m,
        `title: "${newTitle}"`
      );
    } else {
      updatedFrontmatter =
        updatedFrontmatter.trim() +
        (updatedFrontmatter.trim() ? "\n" : "") +
        `title: "${newTitle}"`;
    }
  }

  // Increment version field if requested
  if (incrementVersion) {
    if (/^version:\s*\d+/m.test(updatedFrontmatter)) {
      updatedFrontmatter = updatedFrontmatter.replace(
        /^version:\s*(\d+)/m,
        (_match, currentVersion) => {
          const newVersion = parseInt(currentVersion) + 1;
          return `version: ${newVersion}`;
        }
      );
    } else {
      updatedFrontmatter =
        updatedFrontmatter.trim() +
        (updatedFrontmatter.trim() ? "\n" : "") +
        `version: 1`;
    }
  }

  return `---\n${updatedFrontmatter}\n---\n${body}`;
}
