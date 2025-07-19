import { describe, it, expect } from "bun:test";

// Extract the utility functions from build-data.ts for testing
// Since build-data.ts is a script, we'll recreate the key functions here

function generateCourseIdFromFolderName(folderName: string): string {
  // Remove number prefix and convert to lowercase
  // "1 - Basics" -> "basics"
  // "2 - Array Methods" -> "array-methods"
  return folderName
    .replace(/^\d+\s*-\s*/, "") // Remove number and dash prefix
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ""); // Remove any other special characters
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

describe("build-data utilities", () => {
  describe("generateCourseIdFromFolderName", () => {
    it("should convert basic folder names correctly", () => {
      expect(generateCourseIdFromFolderName("1 - Basics")).toBe("basics");
      expect(generateCourseIdFromFolderName("2 - Array Methods")).toBe(
        "array-methods"
      );
      expect(generateCourseIdFromFolderName("3 - DOM Manipulation")).toBe(
        "dom-manipulation"
      );
    });

    it("should handle different number formats", () => {
      expect(generateCourseIdFromFolderName("01 - Basics")).toBe("basics");
      expect(generateCourseIdFromFolderName("10 - Advanced Topics")).toBe(
        "advanced-topics"
      );
      expect(generateCourseIdFromFolderName("100 - Expert Level")).toBe(
        "expert-level"
      );
    });

    it("should handle varying whitespace", () => {
      expect(generateCourseIdFromFolderName("1- Basics")).toBe("basics");
      expect(generateCourseIdFromFolderName("1 -Basics")).toBe("basics");
      expect(generateCourseIdFromFolderName("1-Basics")).toBe("basics");
      expect(generateCourseIdFromFolderName("1  -  Basics")).toBe("basics");
    });

    it("should remove special characters", () => {
      expect(
        generateCourseIdFromFolderName("1 - JavaScript & TypeScript")
      ).toBe("javascript--typescript");
      expect(generateCourseIdFromFolderName("2 - APIs (REST)")).toBe(
        "apis-rest"
      );
      expect(generateCourseIdFromFolderName("3 - Node.js Basics")).toBe(
        "nodejs-basics"
      );
      expect(generateCourseIdFromFolderName("4 - HTML/CSS")).toBe("htmlcss");
    });

    it("should handle multiple spaces correctly", () => {
      expect(
        generateCourseIdFromFolderName("1 - Very   Long    Course   Name")
      ).toBe("very-long-course-name");
      expect(generateCourseIdFromFolderName("2 - Multi Word Course")).toBe(
        "multi-word-course"
      );
    });

    it("should handle edge cases", () => {
      expect(generateCourseIdFromFolderName("1 - ")).toBe("");
      expect(generateCourseIdFromFolderName("1 - A")).toBe("a");
      expect(generateCourseIdFromFolderName("999 - Single")).toBe("single");
    });

    it("should handle folders without number prefix", () => {
      expect(generateCourseIdFromFolderName("Basics")).toBe("basics");
      expect(generateCourseIdFromFolderName("Array Methods")).toBe(
        "array-methods"
      );
      expect(generateCourseIdFromFolderName("No Number Prefix")).toBe(
        "no-number-prefix"
      );
    });

    it("should preserve numbers in the course name", () => {
      expect(generateCourseIdFromFolderName("1 - HTML5 and CSS3")).toBe(
        "html5-and-css3"
      );
      expect(generateCourseIdFromFolderName("2 - ES6 Features")).toBe(
        "es6-features"
      );
      expect(generateCourseIdFromFolderName("3 - Web 2.0")).toBe("web-20");
    });

    it("should handle Unicode characters", () => {
      expect(generateCourseIdFromFolderName("1 - Básics")).toBe("bsics");
      expect(generateCourseIdFromFolderName("2 - Français")).toBe("franais");
      expect(generateCourseIdFromFolderName("3 - 日本語")).toBe("");
    });
  });

  describe("parseMarkdownFrontmatter", () => {
    it("should parse basic frontmatter", () => {
      const content = `---
title: "Test Title"
order: 1
description: "Test description"
---
This is the body content.`;

      const result = parseMarkdownFrontmatter(content);

      expect(result.frontmatter.title).toBe("Test Title");
      expect(result.frontmatter.order).toBe(1);
      expect(result.frontmatter.description).toBe("Test description");
      expect(result.body).toBe("This is the body content.");
    });

    it("should return empty frontmatter when no frontmatter exists", () => {
      const content = "Just regular markdown content.";
      const result = parseMarkdownFrontmatter(content);

      expect(result.frontmatter).toEqual({});
      expect(result.body).toBe(content);
    });

    it("should handle empty frontmatter", () => {
      const content = `---
---
Body content here.`;

      const result = parseMarkdownFrontmatter(content);

      expect(result.frontmatter).toEqual({});
      expect(result.body).toBe(content); // Returns full content when no valid frontmatter
    });

    it("should parse different data types correctly", () => {
      const content = `---
title: "String Value"
number: 42
boolean: true
null_value: null
array: [1, 2, 3]
object: {"key": "value"}
---
Body`;

      const result = parseMarkdownFrontmatter(content);

      expect(result.frontmatter.title).toBe("String Value");
      expect(result.frontmatter.number).toBe(42);
      expect(result.frontmatter.boolean).toBe(true);
      expect(result.frontmatter.null_value).toBe(null);
      expect(result.frontmatter.array).toEqual([1, 2, 3]);
      expect(result.frontmatter.object).toEqual({ key: "value" });
    });

    it("should handle malformed JSON values as strings", () => {
      const content = `---
title: Not quoted string
invalid_json: {invalid json}
number_like: 42px
---
Body`;

      const result = parseMarkdownFrontmatter(content);

      expect(result.frontmatter.title).toBe("Not quoted string");
      expect(result.frontmatter.invalid_json).toBe("{invalid json}");
      expect(result.frontmatter.number_like).toBe("42px");
    });

    it("should ignore lines without colons", () => {
      const content = `---
title: "Valid Title"
invalid line without colon
order: 1
---
Body`;

      const result = parseMarkdownFrontmatter(content);

      expect(result.frontmatter.title).toBe("Valid Title");
      expect(result.frontmatter.order).toBe(1);
      expect(result.frontmatter["invalid line without colon"]).toBeUndefined();
    });

    it("should handle colons in values", () => {
      const content = `---
url: "https://example.com:8080/path"
time: "12:30:45"
---
Body`;

      const result = parseMarkdownFrontmatter(content);

      expect(result.frontmatter.url).toBe("https://example.com:8080/path");
      expect(result.frontmatter.time).toBe("12:30:45");
    });

    it("should trim whitespace from keys and values", () => {
      const content = `---
  title  :   "Spaced Title"   
  order  :  2  
---
Body`;

      const result = parseMarkdownFrontmatter(content);

      expect(result.frontmatter.title).toBe("Spaced Title");
      expect(result.frontmatter.order).toBe(2);
    });
  });

  describe("extractCodeFromMarkdown", () => {
    it("should extract JavaScript code block", () => {
      const content = `
Some text before.

\`\`\`javascript
console.log("Hello, World!");
const x = 42;
\`\`\`

Some text after.`;

      const result = extractCodeFromMarkdown(content);
      expect(result).toBe('console.log("Hello, World!");\nconst x = 42;');
    });

    it("should return empty string when no JavaScript code block found", () => {
      const content = `
Some text without code blocks.

\`\`\`python
print("This is Python")
\`\`\`

More text.`;

      const result = extractCodeFromMarkdown(content);
      expect(result).toBe("");
    });

    it("should extract multiline JavaScript code", () => {
      const content = `
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");
\`\`\``;

      const result = extractCodeFromMarkdown(content);
      expect(result).toBe(
        'function greet(name) {\n  console.log(`Hello, ${name}!`);\n}\n\ngreet("World");'
      );
    });

    it("should handle empty JavaScript code block", () => {
      const content = `
\`\`\`javascript
\`\`\``;

      const result = extractCodeFromMarkdown(content);
      expect(result).toBe("");
    });

    it("should extract first JavaScript code block when multiple exist", () => {
      const content = `
\`\`\`javascript
const first = 1;
\`\`\`

Some text.

\`\`\`javascript
const second = 2;
\`\`\``;

      const result = extractCodeFromMarkdown(content);
      expect(result).toBe("const first = 1;");
    });

    it("should handle code blocks with special characters", () => {
      const content = `
\`\`\`javascript
const str = "Special chars: !@#$%^&*()";
const regex = /[a-z]+/g;
\`\`\``;

      const result = extractCodeFromMarkdown(content);
      expect(result).toBe(
        'const str = "Special chars: !@#$%^&*()";\nconst regex = /[a-z]+/g;'
      );
    });

    it("should handle nested backticks in code", () => {
      const content = `
\`\`\`javascript
const template = \`This is a \\\`template\\\` string\`;
\`\`\``;

      const result = extractCodeFromMarkdown(content);
      expect(result).toBe(
        "const template = `This is a \\`template\\` string`;"
      );
    });

    it("should handle whitespace-only code blocks", () => {
      const content = `
\`\`\`javascript
   
   
\`\`\``;

      const result = extractCodeFromMarkdown(content);
      expect(result).toBe("   \n   ");
    });
  });

  describe("integration tests", () => {
    it("should handle real-world course folder examples", () => {
      const realExamples = [
        { input: "1 - Basics", expected: "basics" },
        { input: "2 - Array Methods", expected: "array-methods" },
        { input: "3 - DOM Manipulation", expected: "dom-manipulation" },
        { input: "4 - Algorithms", expected: "algorithms" },
        { input: "5 - Remote Data", expected: "remote-data" },
        { input: "6 - Modern JavaScript", expected: "modern-javascript" },
        { input: "7 - TypeScript", expected: "typescript" }
      ];

      realExamples.forEach(({ input, expected }) => {
        expect(generateCourseIdFromFolderName(input)).toBe(expected);
      });
    });

    it("should handle complete markdown document parsing", () => {
      const markdown = `---
title: "Introduction to Variables"
order: 1
expectedOutput: "Hello, World!"
---
In this tutorial, you'll learn about variables.

\`\`\`javascript
let message = "Hello, World!";
console.log(message);
\`\`\`

Variables are containers for storing data.`;

      const parsed = parseMarkdownFrontmatter(markdown);
      const code = extractCodeFromMarkdown(markdown);

      expect(parsed.frontmatter.title).toBe("Introduction to Variables");
      expect(parsed.frontmatter.order).toBe(1);
      expect(parsed.frontmatter.expectedOutput).toBe("Hello, World!");
      expect(code).toBe(
        'let message = "Hello, World!";\nconsole.log(message);'
      );
      expect(parsed.body).toContain("Variables are containers");
    });
  });
});
