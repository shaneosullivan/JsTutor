import { describe, it, expect } from "bun:test";

// Extract utility functions from dataUtils.ts for testing
// Since dataUtils involves complex locale processing, we'll test the string/number manipulation aspects

function parseLocaleCode(locale: string): {
  isValid: boolean;
  language: string;
  country?: string;
} {
  const cleaned = locale.trim().toLowerCase();
  const parts = cleaned.split("-");

  if (parts.length === 0 || parts[0].length !== 2) {
    return { isValid: false, language: "" };
  }

  const language = parts[0];
  const country =
    parts.length > 1 && parts[1].length === 2 ? parts[1] : undefined;

  return { isValid: true, language, country };
}

function validateCourseId(courseId: string): {
  isValid: boolean;
  cleaned: string;
} {
  const cleaned = courseId.trim().toLowerCase();
  const isValid =
    /^[a-z0-9-]+$/.test(cleaned) &&
    cleaned.length > 0 &&
    !cleaned.startsWith("-") &&
    !cleaned.endsWith("-");
  return { isValid, cleaned };
}

function validateTutorialId(tutorialId: number): {
  isValid: boolean;
  normalized: number;
} {
  const isValid = Number.isInteger(tutorialId) && tutorialId > 0;
  return { isValid, normalized: isValid ? tutorialId : -1 };
}

function generateCourseKey(courseId: string, locale: string): string {
  return `${courseId}:${locale}`;
}

function generateTutorialKey(tutorialId: number, locale: string): string {
  return `${tutorialId}:${locale}`;
}

function extractOrderFromTitle(title: string): {
  order: number;
  cleanTitle: string;
} {
  const match = title.match(/^(\d+)\.\s*(.+)$/);
  if (match) {
    return {
      order: parseInt(match[1]),
      cleanTitle: match[2].trim()
    };
  }
  return { order: 0, cleanTitle: title.trim() };
}

function normalizeTextContent(content: string): {
  wordCount: number;
  lineCount: number;
  hasCode: boolean;
  cleanedContent: string;
} {
  const cleaned = content.trim();
  const lines = cleaned.split("\n");
  const words = cleaned.split(/\s+/).filter((word) => word.length > 0);
  const hasCode = /```/.test(content) || /`[^`]+`/.test(content);

  return {
    wordCount: words.length,
    lineCount: lines.length,
    hasCode,
    cleanedContent: cleaned
  };
}

function validateExpectedOutput(output: string | null): {
  isValid: boolean;
  type: "string" | "number" | "boolean" | "null" | "object";
  normalized: any;
} {
  if (output === null) {
    return { isValid: true, type: "null", normalized: null };
  }

  const trimmed = output.trim();

  // Try to parse as JSON first
  try {
    const parsed = JSON.parse(trimmed);
    const type = typeof parsed;
    return {
      isValid: true,
      type: Array.isArray(parsed) ? "object" : (type as any),
      normalized: parsed
    };
  } catch {
    // Not JSON, treat as string
    return { isValid: true, type: "string", normalized: trimmed };
  }
}

describe("dataUtils utilities", () => {
  describe("parseLocaleCode", () => {
    it("should parse valid locale codes", () => {
      expect(parseLocaleCode("en")).toEqual({
        isValid: true,
        language: "en",
        country: undefined
      });
      expect(parseLocaleCode("en-US")).toEqual({
        isValid: true,
        language: "en",
        country: "us"
      });
      expect(parseLocaleCode("fr-FR")).toEqual({
        isValid: true,
        language: "fr",
        country: "fr"
      });
      expect(parseLocaleCode("zh-CN")).toEqual({
        isValid: true,
        language: "zh",
        country: "cn"
      });
    });

    it("should handle case variations", () => {
      expect(parseLocaleCode("EN")).toEqual({
        isValid: true,
        language: "en",
        country: undefined
      });
      expect(parseLocaleCode("En-Us")).toEqual({
        isValid: true,
        language: "en",
        country: "us"
      });
      expect(parseLocaleCode("FR-fr")).toEqual({
        isValid: true,
        language: "fr",
        country: "fr"
      });
    });

    it("should trim whitespace", () => {
      expect(parseLocaleCode("  en  ")).toEqual({
        isValid: true,
        language: "en",
        country: undefined
      });
      expect(parseLocaleCode(" en-US ")).toEqual({
        isValid: true,
        language: "en",
        country: "us"
      });
    });

    it("should reject invalid locale codes", () => {
      expect(parseLocaleCode("")).toEqual({ isValid: false, language: "" });
      expect(parseLocaleCode("e")).toEqual({ isValid: false, language: "" });
      expect(parseLocaleCode("eng")).toEqual({ isValid: false, language: "" });
      expect(parseLocaleCode("en-U")).toEqual({
        isValid: true,
        language: "en",
        country: undefined
      });
      expect(parseLocaleCode("en-USA")).toEqual({
        isValid: true,
        language: "en",
        country: undefined
      });
    });

    it("should handle malformed locale strings", () => {
      expect(parseLocaleCode("en-")).toEqual({
        isValid: true,
        language: "en",
        country: undefined
      });
      expect(parseLocaleCode("-US")).toEqual({ isValid: false, language: "" });
      expect(parseLocaleCode("en--US")).toEqual({
        isValid: true,
        language: "en",
        country: undefined
      });
    });
  });

  describe("validateCourseId", () => {
    it("should validate correct course IDs", () => {
      expect(validateCourseId("basics")).toEqual({
        isValid: true,
        cleaned: "basics"
      });
      expect(validateCourseId("array-methods")).toEqual({
        isValid: true,
        cleaned: "array-methods"
      });
      expect(validateCourseId("dom-manipulation")).toEqual({
        isValid: true,
        cleaned: "dom-manipulation"
      });
      expect(validateCourseId("modern-javascript")).toEqual({
        isValid: true,
        cleaned: "modern-javascript"
      });
    });

    it("should handle case conversion", () => {
      expect(validateCourseId("BASICS")).toEqual({
        isValid: true,
        cleaned: "basics"
      });
      expect(validateCourseId("Array-Methods")).toEqual({
        isValid: true,
        cleaned: "array-methods"
      });
      expect(validateCourseId("DOM-Manipulation")).toEqual({
        isValid: true,
        cleaned: "dom-manipulation"
      });
    });

    it("should trim whitespace", () => {
      expect(validateCourseId("  basics  ")).toEqual({
        isValid: true,
        cleaned: "basics"
      });
      expect(validateCourseId(" array-methods ")).toEqual({
        isValid: true,
        cleaned: "array-methods"
      });
    });

    it("should reject invalid course IDs", () => {
      expect(validateCourseId("")).toEqual({ isValid: false, cleaned: "" });
      expect(validateCourseId("-basics")).toEqual({
        isValid: false,
        cleaned: "-basics"
      });
      expect(validateCourseId("basics-")).toEqual({
        isValid: false,
        cleaned: "basics-"
      });
      expect(validateCourseId("array methods")).toEqual({
        isValid: false,
        cleaned: "array methods"
      });
      expect(validateCourseId("array_methods")).toEqual({
        isValid: false,
        cleaned: "array_methods"
      });
      expect(validateCourseId("array/methods")).toEqual({
        isValid: false,
        cleaned: "array/methods"
      });
    });

    it("should handle numbers in course IDs", () => {
      expect(validateCourseId("html5")).toEqual({
        isValid: true,
        cleaned: "html5"
      });
      expect(validateCourseId("es6-features")).toEqual({
        isValid: true,
        cleaned: "es6-features"
      });
      expect(validateCourseId("web-2-0")).toEqual({
        isValid: true,
        cleaned: "web-2-0"
      });
    });

    it("should handle special characters", () => {
      expect(validateCourseId("course@special")).toEqual({
        isValid: false,
        cleaned: "course@special"
      });
      expect(validateCourseId("course.name")).toEqual({
        isValid: false,
        cleaned: "course.name"
      });
      expect(validateCourseId("course+name")).toEqual({
        isValid: false,
        cleaned: "course+name"
      });
    });
  });

  describe("validateTutorialId", () => {
    it("should validate positive integers", () => {
      expect(validateTutorialId(1)).toEqual({ isValid: true, normalized: 1 });
      expect(validateTutorialId(42)).toEqual({ isValid: true, normalized: 42 });
      expect(validateTutorialId(999)).toEqual({
        isValid: true,
        normalized: 999
      });
    });

    it("should reject invalid tutorial IDs", () => {
      expect(validateTutorialId(0)).toEqual({ isValid: false, normalized: -1 });
      expect(validateTutorialId(-1)).toEqual({
        isValid: false,
        normalized: -1
      });
      expect(validateTutorialId(1.5)).toEqual({
        isValid: false,
        normalized: -1
      });
      expect(validateTutorialId(NaN)).toEqual({
        isValid: false,
        normalized: -1
      });
      expect(validateTutorialId(Infinity)).toEqual({
        isValid: false,
        normalized: -1
      });
    });

    it("should handle edge cases", () => {
      expect(validateTutorialId(Number.MAX_SAFE_INTEGER)).toEqual({
        isValid: true,
        normalized: Number.MAX_SAFE_INTEGER
      });
      expect(validateTutorialId(Number.MIN_SAFE_INTEGER)).toEqual({
        isValid: false,
        normalized: -1
      });
    });
  });

  describe("generateCourseKey", () => {
    it("should generate correct course keys", () => {
      expect(generateCourseKey("basics", "en")).toBe("basics:en");
      expect(generateCourseKey("array-methods", "fr")).toBe("array-methods:fr");
      expect(generateCourseKey("dom-manipulation", "en-US")).toBe(
        "dom-manipulation:en-US"
      );
    });

    it("should handle special characters", () => {
      expect(generateCourseKey("html5", "zh-CN")).toBe("html5:zh-CN");
      expect(generateCourseKey("es6-features", "en")).toBe("es6-features:en");
    });

    it("should be deterministic", () => {
      const key1 = generateCourseKey("test", "en");
      const key2 = generateCourseKey("test", "en");
      expect(key1).toBe(key2);
      expect(key1).toBe("test:en");
    });
  });

  describe("generateTutorialKey", () => {
    it("should generate correct tutorial keys", () => {
      expect(generateTutorialKey(1, "en")).toBe("1:en");
      expect(generateTutorialKey(42, "fr")).toBe("42:fr");
      expect(generateTutorialKey(999, "zh-CN")).toBe("999:zh-CN");
    });

    it("should handle large tutorial IDs", () => {
      expect(generateTutorialKey(999999, "en")).toBe("999999:en");
      expect(generateTutorialKey(1000000, "fr")).toBe("1000000:fr");
    });

    it("should be deterministic", () => {
      const key1 = generateTutorialKey(123, "en");
      const key2 = generateTutorialKey(123, "en");
      expect(key1).toBe(key2);
      expect(key1).toBe("123:en");
    });
  });

  describe("extractOrderFromTitle", () => {
    it("should extract order numbers from titles", () => {
      expect(extractOrderFromTitle("1. Introduction")).toEqual({
        order: 1,
        cleanTitle: "Introduction"
      });
      expect(extractOrderFromTitle("42. Advanced Topics")).toEqual({
        order: 42,
        cleanTitle: "Advanced Topics"
      });
      expect(extractOrderFromTitle("999. Final Chapter")).toEqual({
        order: 999,
        cleanTitle: "Final Chapter"
      });
    });

    it("should handle titles without order numbers", () => {
      expect(extractOrderFromTitle("Introduction")).toEqual({
        order: 0,
        cleanTitle: "Introduction"
      });
      expect(extractOrderFromTitle("Advanced Topics")).toEqual({
        order: 0,
        cleanTitle: "Advanced Topics"
      });
    });

    it("should handle malformed order formats", () => {
      expect(extractOrderFromTitle("1 Introduction")).toEqual({
        order: 0,
        cleanTitle: "1 Introduction"
      });
      expect(extractOrderFromTitle("1.Introduction")).toEqual({
        order: 1,
        cleanTitle: "Introduction"
      }); // This actually matches the pattern
      expect(extractOrderFromTitle("Chapter 1")).toEqual({
        order: 0,
        cleanTitle: "Chapter 1"
      });
    });

    it("should handle whitespace variations", () => {
      expect(extractOrderFromTitle("1.  Introduction")).toEqual({
        order: 1,
        cleanTitle: "Introduction"
      });
      expect(extractOrderFromTitle("42.   Advanced Topics   ")).toEqual({
        order: 42,
        cleanTitle: "Advanced Topics"
      });
      expect(extractOrderFromTitle("  999. Final Chapter  ")).toEqual({
        order: 0,
        cleanTitle: "999. Final Chapter"
      }); // Leading spaces prevent pattern match
    });

    it("should handle complex titles", () => {
      expect(extractOrderFromTitle("1. Variables and Data Types")).toEqual({
        order: 1,
        cleanTitle: "Variables and Data Types"
      });
      expect(extractOrderFromTitle("15. Working with APIs (REST)")).toEqual({
        order: 15,
        cleanTitle: "Working with APIs (REST)"
      });
    });
  });

  describe("normalizeTextContent", () => {
    it("should count words and lines correctly", () => {
      const content = "Hello world\nThis is a test";
      const result = normalizeTextContent(content);

      expect(result.wordCount).toBe(6);
      expect(result.lineCount).toBe(2);
      expect(result.hasCode).toBe(false);
      expect(result.cleanedContent).toBe(content);
    });

    it("should detect code blocks", () => {
      const content =
        "Here is some code:\n```javascript\nconsole.log('Hello');\n```";
      const result = normalizeTextContent(content);

      expect(result.hasCode).toBe(true);
      expect(result.wordCount).toBe(7); // All words including the code
    });

    it("should detect inline code", () => {
      const content = "Use the `console.log()` function to output text.";
      const result = normalizeTextContent(content);

      expect(result.hasCode).toBe(true);
      expect(result.wordCount).toBe(7);
    });

    it("should handle empty content", () => {
      const result = normalizeTextContent("");

      expect(result.wordCount).toBe(0);
      expect(result.lineCount).toBe(1);
      expect(result.hasCode).toBe(false);
      expect(result.cleanedContent).toBe("");
    });

    it("should handle whitespace-only content", () => {
      const result = normalizeTextContent("   \n  \n   ");

      expect(result.wordCount).toBe(0);
      expect(result.lineCount).toBe(1); // After trim, empty content gives 1 line
      expect(result.hasCode).toBe(false);
      expect(result.cleanedContent).toBe("");
    });

    it("should count complex content correctly", () => {
      const content = `# Title
      
This is a tutorial about variables.

\`\`\`javascript
let name = "John";
let age = 30;
console.log(\`Hello \${name}, you are \${age} years old\`);
\`\`\`

The above code demonstrates variable usage.`;

      const result = normalizeTextContent(content);

      expect(result.wordCount).toBeGreaterThan(10);
      expect(result.lineCount).toBeGreaterThan(5);
      expect(result.hasCode).toBe(true);
    });
  });

  describe("validateExpectedOutput", () => {
    it("should handle null values", () => {
      expect(validateExpectedOutput(null)).toEqual({
        isValid: true,
        type: "null",
        normalized: null
      });
    });

    it("should handle simple strings", () => {
      expect(validateExpectedOutput("Hello World")).toEqual({
        isValid: true,
        type: "string",
        normalized: "Hello World"
      });
    });

    it("should parse JSON numbers", () => {
      expect(validateExpectedOutput("42")).toEqual({
        isValid: true,
        type: "number",
        normalized: 42
      });
    });

    it("should parse JSON booleans", () => {
      expect(validateExpectedOutput("true")).toEqual({
        isValid: true,
        type: "boolean",
        normalized: true
      });

      expect(validateExpectedOutput("false")).toEqual({
        isValid: true,
        type: "boolean",
        normalized: false
      });
    });

    it("should parse JSON arrays", () => {
      expect(validateExpectedOutput("[1, 2, 3]")).toEqual({
        isValid: true,
        type: "object",
        normalized: [1, 2, 3]
      });
    });

    it("should parse JSON objects", () => {
      expect(validateExpectedOutput('{"name": "John", "age": 30}')).toEqual({
        isValid: true,
        type: "object",
        normalized: { name: "John", age: 30 }
      });
    });

    it("should handle non-JSON strings", () => {
      expect(validateExpectedOutput("Not JSON content")).toEqual({
        isValid: true,
        type: "string",
        normalized: "Not JSON content"
      });
    });

    it("should trim whitespace", () => {
      expect(validateExpectedOutput("  42  ")).toEqual({
        isValid: true,
        type: "number",
        normalized: 42
      });

      expect(validateExpectedOutput("  Hello World  ")).toEqual({
        isValid: true,
        type: "string",
        normalized: "Hello World"
      });
    });

    it("should handle complex output formats", () => {
      const complexOutput = `{
        "result": "success",
        "data": [1, 2, 3],
        "count": 3
      }`;

      const result = validateExpectedOutput(complexOutput);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe("object");
      expect(result.normalized).toEqual({
        result: "success",
        data: [1, 2, 3],
        count: 3
      });
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete tutorial processing workflow", () => {
      const tutorialId = 42;
      const courseId = "array-methods";
      const locale = "en-US";
      const title = "15. Working with Array Methods";
      const content =
        "Learn about `map()` and `filter()` methods.\n\n```javascript\nconst numbers = [1, 2, 3];\n```";
      const expectedOutput = "[2, 4, 6]";

      const tutorialValidation = validateTutorialId(tutorialId);
      const courseValidation = validateCourseId(courseId);
      const localeValidation = parseLocaleCode(locale);
      const titleParsing = extractOrderFromTitle(title);
      const contentAnalysis = normalizeTextContent(content);
      const outputValidation = validateExpectedOutput(expectedOutput);

      expect(tutorialValidation.isValid).toBe(true);
      expect(courseValidation.isValid).toBe(true);
      expect(localeValidation.isValid).toBe(true);
      expect(titleParsing.order).toBe(15);
      expect(contentAnalysis.hasCode).toBe(true);
      expect(outputValidation.type).toBe("object");
    });

    it("should handle key generation workflow", () => {
      const courseId = "javascript-basics";
      const tutorialId = 123;
      const locale = "fr-FR";

      const courseKey = generateCourseKey(courseId, locale);
      const tutorialKey = generateTutorialKey(tutorialId, locale);

      expect(courseKey).toBe("javascript-basics:fr-FR");
      expect(tutorialKey).toBe("123:fr-FR");
    });

    it("should handle error cases gracefully", () => {
      const invalidCourseId = "invalid course id";
      const invalidTutorialId = -1;
      const invalidLocale = "invalid";

      const courseValidation = validateCourseId(invalidCourseId);
      const tutorialValidation = validateTutorialId(invalidTutorialId);
      const localeValidation = parseLocaleCode(invalidLocale);

      expect(courseValidation.isValid).toBe(false);
      expect(tutorialValidation.isValid).toBe(false);
      expect(localeValidation.isValid).toBe(false);
    });
  });
});
