import { describe, it, expect } from "bun:test";
import {
  generateCourseIdFromFolderName,
  parseMarkdownFrontmatter,
  extractCodeFromMarkdown,
  generateTutorialIdFromFolderName,
  updateFrontmatterOrder
} from "../lib/build-data-utils.js";

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

  describe("generateTutorialIdFromFolderName", () => {
    it("should convert tutorial folder names correctly (removing number prefix)", () => {
      expect(generateTutorialIdFromFolderName("1 - Your First Variable")).toBe(
        "your-first-variable"
      );
      expect(generateTutorialIdFromFolderName("2 - Maths is Fun!")).toBe(
        "maths-is-fun"
      );
      expect(generateTutorialIdFromFolderName("3 - Shortcuts with Math")).toBe(
        "shortcuts-with-math"
      );
      expect(generateTutorialIdFromFolderName("10 - Random Fun")).toBe(
        "random-fun"
      );
    });

    it("should handle different number formats", () => {
      expect(generateTutorialIdFromFolderName("01 - First Tutorial")).toBe(
        "first-tutorial"
      );
      expect(generateTutorialIdFromFolderName("100 - Advanced Tutorial")).toBe(
        "advanced-tutorial"
      );
      expect(generateTutorialIdFromFolderName("999 - Last Tutorial")).toBe(
        "last-tutorial"
      );
    });

    it("should handle varying whitespace around dash", () => {
      expect(generateTutorialIdFromFolderName("1- Your Tutorial")).toBe(
        "your-tutorial"
      );
      expect(generateTutorialIdFromFolderName("1 -Your Tutorial")).toBe(
        "your-tutorial"
      );
      expect(generateTutorialIdFromFolderName("1-Your Tutorial")).toBe(
        "your-tutorial"
      );
      expect(generateTutorialIdFromFolderName("1  -  Your Tutorial")).toBe(
        "your-tutorial"
      );
    });

    it("should remove special characters and normalize spaces", () => {
      expect(
        generateTutorialIdFromFolderName("1 - JavaScript & TypeScript")
      ).toBe("javascript-typescript");
      expect(generateTutorialIdFromFolderName("2 - APIs (REST)")).toBe(
        "apis-rest"
      );
      expect(generateTutorialIdFromFolderName("3 - Node.js Basics")).toBe(
        "nodejs-basics"
      );
      expect(generateTutorialIdFromFolderName("4 - HTML/CSS")).toBe("htmlcss");
      expect(generateTutorialIdFromFolderName("5 - Making Decisions?")).toBe(
        "making-decisions"
      );
    });

    it("should handle multiple consecutive spaces and hyphens", () => {
      expect(
        generateTutorialIdFromFolderName("1 - Very   Long    Tutorial   Name")
      ).toBe("very-long-tutorial-name");
      expect(
        generateTutorialIdFromFolderName("2 - Multi  -  Word  -  Tutorial")
      ).toBe("multi-word-tutorial");
      expect(
        generateTutorialIdFromFolderName("3 - Tutorial---With---Dashes")
      ).toBe("tutorialwithdashes");
    });

    it("should handle edge cases", () => {
      expect(generateTutorialIdFromFolderName("1 - ")).toBe("");
      expect(generateTutorialIdFromFolderName("1 - A")).toBe("a");
      expect(generateTutorialIdFromFolderName("999 - Single")).toBe("single");
      expect(generateTutorialIdFromFolderName("1 - -")).toBe("");
    });

    it("should handle real-world tutorial examples", () => {
      const realExamples = [
        { input: "1 - Your First Variable", expected: "your-first-variable" },
        {
          input: "2 - forEach - Do Something with Each Item",
          expected: "foreach-do-something-with-each-item"
        },
        { input: "3 - What is HTML?", expected: "what-is-html" },
        {
          input: "4 - Arrow Functions - The Cool New Way to Write Functions",
          expected: "arrow-functions-the-cool-new-way-to-write-functions"
        },
        {
          input: "5 - Async/Await - Making Promises Even Easier!",
          expected: "asyncawait-making-promises-even-easier"
        },
        { input: "13 - Snake Game", expected: "snake-game" },
        { input: "14 - Your Own Game!", expected: "your-own-game" }
      ];

      realExamples.forEach(({ input, expected }) => {
        expect(generateTutorialIdFromFolderName(input)).toBe(expected);
      });
    });

    it("should preserve numbers in tutorial names", () => {
      expect(generateTutorialIdFromFolderName("1 - HTML5 and CSS3")).toBe(
        "html5-and-css3"
      );
      expect(generateTutorialIdFromFolderName("2 - ES6 Features")).toBe(
        "es6-features"
      );
      expect(generateTutorialIdFromFolderName("3 - Web 2.0")).toBe("web-20");
    });

    it("should handle Unicode and international characters", () => {
      expect(generateTutorialIdFromFolderName("1 - Básic Tutorial")).toBe(
        "bsic-tutorial"
      );
      expect(generateTutorialIdFromFolderName("2 - Café Script")).toBe(
        "caf-script"
      );
      expect(generateTutorialIdFromFolderName("3 - Naïve Implementation")).toBe(
        "nave-implementation"
      );
    });

    it("should handle old format (just numbers)", () => {
      // When folder is just "1", the function should still work
      expect(generateTutorialIdFromFolderName("1")).toBe("1");
      expect(generateTutorialIdFromFolderName("42")).toBe("42");
      expect(generateTutorialIdFromFolderName("100")).toBe("100");
    });

    it("should handle folders without number prefix", () => {
      expect(generateTutorialIdFromFolderName("Your First Variable")).toBe(
        "your-first-variable"
      );
      expect(generateTutorialIdFromFolderName("forEach Tutorial")).toBe(
        "foreach-tutorial"
      );
      expect(generateTutorialIdFromFolderName("Advanced Topics")).toBe(
        "advanced-topics"
      );
    });

    it("should remove leading and trailing hyphens", () => {
      expect(generateTutorialIdFromFolderName("1 - -Leading Hyphen")).toBe(
        "leading-hyphen"
      );
      expect(generateTutorialIdFromFolderName("1 - Trailing Hyphen-")).toBe(
        "trailing-hyphen"
      );
      expect(generateTutorialIdFromFolderName("1 - -Both-")).toBe("both");
    });
  });

  describe("updateFrontmatterOrder", () => {
    it("should update both id and order in frontmatter", () => {
      const content = `---
id: "old-id"
courseId: "basics"
title: "Test Tutorial"
order: 1
version: 1
---
This is the tutorial content.`;

      const result = updateFrontmatterOrder(content, 5, "new-tutorial-id");

      expect(result).toContain('id: "new-tutorial-id"');
      expect(result).toContain("order: 5");
      expect(result).toContain('courseId: "basics"');
      expect(result).toContain('title: "Test Tutorial"');
      expect(result).toContain("This is the tutorial content.");
    });

    it("should handle different id formats", () => {
      const testCases = [
        'id: "quoted-id"',
        "id: old-unquoted-id",
        "id: 123",
        "id: null"
      ];

      testCases.forEach((idLine) => {
        const content = `---
${idLine}
order: 1
---
Content`;

        const result = updateFrontmatterOrder(content, 3, "new-id");
        expect(result).toContain('id: "new-id"');
        expect(result).toContain("order: 3");
      });
    });

    it("should handle different order formats", () => {
      const testCases = ["order: 1", "order:1", "order: 42", "order: 999"];

      testCases.forEach((orderLine) => {
        const content = `---
id: "test-id"
${orderLine}
---
Content`;

        const result = updateFrontmatterOrder(content, 7, "test-id");
        expect(result).toContain("order: 7");
        expect(result).toContain('id: "test-id"');
      });
    });

    it("should preserve other frontmatter fields", () => {
      const content = `---
id: "old-id"
courseId: "basics"
title: "Tutorial Title"
description: "Tutorial description"
expectedOutput: "Expected output"
order: 1
version: 1
author: "Test Author"
tags: ["tag1", "tag2"]
---
Tutorial body content
with multiple lines.`;

      const result = updateFrontmatterOrder(content, 10, "updated-id");

      expect(result).toContain('id: "updated-id"');
      expect(result).toContain("order: 10");
      expect(result).toContain('courseId: "basics"');
      expect(result).toContain('title: "Tutorial Title"');
      expect(result).toContain('description: "Tutorial description"');
      expect(result).toContain('expectedOutput: "Expected output"');
      expect(result).toContain("version: 1");
      expect(result).toContain('author: "Test Author"');
      expect(result).toContain('tags: ["tag1", "tag2"]');
      expect(result).toContain("Tutorial body content\nwith multiple lines.");
    });

    it("should return original content when no frontmatter exists", () => {
      const content = `This is just regular markdown content
without any frontmatter.`;

      const result = updateFrontmatterOrder(content, 5, "new-id");
      expect(result).toBe(content);
    });

    it("should handle empty frontmatter", () => {
      const content = `---
---
Body content`;

      const result = updateFrontmatterOrder(content, 3, "test-id");

      // The function should add id and order to empty frontmatter
      expect(result).toContain('id: "test-id"');
      expect(result).toContain("order: 3");
      expect(result).toContain("Body content");
    });

    it("should handle multiline body content", () => {
      const content = `---
id: "test-id"
order: 1
---

# Tutorial Title

This is a longer tutorial with:

- Multiple sections
- Code examples
- Lists and formatting

\`\`\`javascript
const example = "code";
\`\`\`

More content here.`;

      const result = updateFrontmatterOrder(content, 8, "updated-tutorial-id");

      expect(result).toContain('id: "updated-tutorial-id"');
      expect(result).toContain("order: 8");
      expect(result).toContain("# Tutorial Title");
      expect(result).toContain('const example = "code";');
      expect(result).toContain("More content here.");
    });

    it("should handle edge cases with special characters in id", () => {
      const specialIds = [
        "tutorial-with-hyphens",
        "tutorial_with_underscores",
        "tutorial123numbers",
        "tutorial-with-many-hyphens-and-words"
      ];

      specialIds.forEach((specialId) => {
        const content = `---
id: "old-id"
order: 1
---
Content`;

        const result = updateFrontmatterOrder(content, 2, specialId);
        expect(result).toContain(`id: "${specialId}"`);
        expect(result).toContain("order: 2");
      });
    });

    it("should handle large order numbers", () => {
      const content = `---
id: "test-id"
order: 1
---
Content`;

      const result = updateFrontmatterOrder(content, 999, "test-id");
      expect(result).toContain("order: 999");
    });

    it("should maintain frontmatter formatting", () => {
      const content = `---
id: "old-id"
courseId: "basics"
title: "Test"
order: 1
---
Body`;

      const result = updateFrontmatterOrder(content, 3, "new-id");

      // Check that the overall structure is maintained
      expect(result.startsWith("---\n")).toBe(true);
      expect(result).toContain("\n---\n");
      expect(result.endsWith("Body")).toBe(true);

      // Verify the updated content
      const lines = result.split("\n");
      expect(lines.find((line) => line.includes("id:"))).toContain(
        'id: "new-id"'
      );
      expect(lines.find((line) => line.includes("order:"))).toContain(
        "order: 3"
      );
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

    it("should handle complete tutorial folder renaming workflow", () => {
      // Simulate renaming "1 - Your First Variable" to "3 - Your First Variable"
      const originalFolderName = "1 - Your First Variable";
      const newFolderName = "3 - Your First Variable";

      const originalId = generateTutorialIdFromFolderName(originalFolderName);
      const newId = generateTutorialIdFromFolderName(newFolderName);

      // IDs should be the same (stable)
      expect(originalId).toBe("your-first-variable");
      expect(newId).toBe("your-first-variable");

      const frontmatter = `---
id: "${originalId}"
courseId: "basics"
title: "Your First Variable"
order: 1
---
Tutorial content here.`;

      // Extract new order from folder name
      const newOrder = parseInt(newFolderName.match(/^\d+/)?.[0] || "1");
      expect(newOrder).toBe(3);

      const updatedFrontmatter = updateFrontmatterOrder(
        frontmatter,
        newOrder,
        newId
      );

      expect(updatedFrontmatter).toContain('id: "your-first-variable"');
      expect(updatedFrontmatter).toContain("order: 3");
      expect(updatedFrontmatter).toContain('title: "Your First Variable"');
    });

    it("should handle number extraction from various folder formats", () => {
      const testCases = [
        { folder: "1 - Tutorial", expectedOrder: 1 },
        { folder: "01 - Tutorial", expectedOrder: 1 },
        { folder: "10 - Tutorial", expectedOrder: 10 },
        { folder: "999 - Tutorial", expectedOrder: 999 },
        { folder: "42-Tutorial", expectedOrder: 42 },
        { folder: "5  -  Tutorial", expectedOrder: 5 }
      ];

      testCases.forEach(({ folder, expectedOrder }) => {
        const extractedOrder = parseInt(folder.match(/^\d+/)?.[0] || "1");
        expect(extractedOrder).toBe(expectedOrder);
      });
    });

    it("should handle complete build-data workflow simulation", () => {
      // Simulate the key operations that build-data.ts performs
      const tutorialFolders = [
        "1 - Your First Variable",
        "2 - Maths is Fun!",
        "3 - Shortcuts with Math"
      ];

      const processedTutorials = tutorialFolders.map((folder) => {
        const order = parseInt(folder.match(/^\d+/)?.[0] || "1");
        const id = generateTutorialIdFromFolderName(folder);

        return {
          folder,
          id,
          order,
          courseId: "basics"
        };
      });

      expect(processedTutorials).toEqual([
        {
          folder: "1 - Your First Variable",
          id: "your-first-variable",
          order: 1,
          courseId: "basics"
        },
        {
          folder: "2 - Maths is Fun!",
          id: "maths-is-fun",
          order: 2,
          courseId: "basics"
        },
        {
          folder: "3 - Shortcuts with Math",
          id: "shortcuts-with-math",
          order: 3,
          courseId: "basics"
        }
      ]);
    });

    it("should handle edge cases in number extraction", () => {
      const edgeCases = [
        { input: "0 - Zero Start", expected: 0 },
        { input: "999999 - Large Number", expected: 999999 },
        { input: "Tutorial Without Number", expected: 1 }, // fallback
        { input: "123456789 - Very Large", expected: 123456789 }
      ];

      edgeCases.forEach(({ input, expected }) => {
        const extracted = parseInt(input.match(/^\d+/)?.[0] || "1");
        expect(extracted).toBe(expected);
      });
    });

    it("should validate ID stability across order changes", () => {
      // Test that renaming tutorials preserves ID stability
      const baseTitle = "Your First Variable";
      const orders = [1, 2, 5, 10, 99];

      const ids = orders.map((order) =>
        generateTutorialIdFromFolderName(`${order} - ${baseTitle}`)
      );

      // All IDs should be identical regardless of order
      ids.forEach((id) => {
        expect(id).toBe("your-first-variable");
      });

      // This proves that reordering tutorials won't break references
    });
  });
});
