import { describe, it, expect } from "bun:test";

// Simple utilities for string and number manipulation
function formatCourseTitle(title: string): string {
  const cleaned = title.trim().toLowerCase();
  if (cleaned === "") {
    return "";
  }
  return cleaned.replace(/\s+/g, "-");
}

function parseInteger(value: string): { isValid: boolean; number: number } {
  const trimmed = value.trim();
  const num = parseInt(trimmed, 10);
  return {
    isValid: !isNaN(num) && trimmed === num.toString(),
    number: isNaN(num) ? 0 : num
  };
}

function generateId(prefix: string, suffix: number): string {
  return `${prefix}_${suffix}`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

function extractNumber(text: string): number | null {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

describe("Simple utilities", () => {
  describe("formatCourseTitle", () => {
    it("should format course titles correctly", () => {
      expect(formatCourseTitle("JavaScript Basics")).toBe("javascript-basics");
      expect(formatCourseTitle("Array Methods")).toBe("array-methods");
      expect(formatCourseTitle("DOM Manipulation")).toBe("dom-manipulation");
    });

    it("should handle multiple spaces", () => {
      expect(formatCourseTitle("Very   Long    Course   Name")).toBe(
        "very-long-course-name"
      );
    });

    it("should handle edge cases", () => {
      expect(formatCourseTitle("")).toBe("");
      expect(formatCourseTitle("   ")).toBe("");
      expect(formatCourseTitle("Single")).toBe("single");
    });
  });

  describe("parseInteger", () => {
    it("should parse valid integers", () => {
      expect(parseInteger("42")).toEqual({ isValid: true, number: 42 });
      expect(parseInteger("0")).toEqual({ isValid: true, number: 0 });
      expect(parseInteger("999")).toEqual({ isValid: true, number: 999 });
    });

    it("should reject invalid inputs", () => {
      expect(parseInteger("abc")).toEqual({ isValid: false, number: 0 });
      expect(parseInteger("42.5")).toEqual({ isValid: false, number: 42 });
      expect(parseInteger("")).toEqual({ isValid: false, number: 0 });
      expect(parseInteger(" 42 ")).toEqual({ isValid: true, number: 42 }); // Trimmed input is valid
    });
  });

  describe("generateId", () => {
    it("should generate IDs correctly", () => {
      expect(generateId("user", 123)).toBe("user_123");
      expect(generateId("course", 456)).toBe("course_456");
      expect(generateId("tutorial", 0)).toBe("tutorial_0");
    });

    it("should handle special characters in prefix", () => {
      expect(generateId("user-profile", 123)).toBe("user-profile_123");
      expect(generateId("test@example", 456)).toBe("test@example_456");
    });
  });

  describe("validateEmail", () => {
    it("should validate correct emails", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.org")).toBe(true);
      expect(validateEmail("valid+tag@gmail.com")).toBe(true);
    });

    it("should reject invalid emails", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });

    it("should handle whitespace", () => {
      expect(validateEmail("  test@example.com  ")).toBe(true);
      expect(validateEmail("test @example.com")).toBe(false);
    });
  });

  describe("countWords", () => {
    it("should count words correctly", () => {
      expect(countWords("Hello world")).toBe(2);
      expect(countWords("This is a test")).toBe(4);
      expect(countWords("")).toBe(0);
      expect(countWords("   ")).toBe(0);
    });

    it("should handle multiple spaces", () => {
      expect(countWords("Hello    world")).toBe(2);
      expect(countWords("  This   is   a   test  ")).toBe(4);
    });

    it("should handle special characters", () => {
      expect(countWords("Hello, world!")).toBe(2);
      expect(countWords("test@example.com")).toBe(1);
    });
  });

  describe("extractNumber", () => {
    it("should extract first number from text", () => {
      expect(extractNumber("Course 123")).toBe(123);
      expect(extractNumber("Tutorial #42")).toBe(42);
      expect(extractNumber("Step 1 of 10")).toBe(1);
    });

    it("should return null when no number found", () => {
      expect(extractNumber("No numbers here")).toBe(null);
      expect(extractNumber("")).toBe(null);
      expect(extractNumber("abc")).toBe(null);
    });

    it("should handle edge cases", () => {
      expect(extractNumber("0")).toBe(0);
      expect(extractNumber("Leading text 999 trailing")).toBe(999);
      expect(extractNumber("Multiple 12 numbers 34")).toBe(12);
    });
  });

  describe("integration scenarios", () => {
    it("should handle course processing workflow", () => {
      const title = "Advanced JavaScript";
      const idNumber = "42";

      const formattedTitle = formatCourseTitle(title);
      const parsedId = parseInteger(idNumber);

      if (parsedId.isValid) {
        const courseId = generateId(formattedTitle, parsedId.number);
        expect(courseId).toBe("advanced-javascript_42");
      }

      expect(formattedTitle).toBe("advanced-javascript");
      expect(parsedId.isValid).toBe(true);
    });

    it("should handle user data validation", () => {
      const email = "user@example.com";
      const bio = "I am a developer with 5 years experience";

      const isValidEmail = validateEmail(email);
      const wordCount = countWords(bio);
      const experience = extractNumber(bio);

      expect(isValidEmail).toBe(true);
      expect(wordCount).toBe(8);
      expect(experience).toBe(5);
    });

    it("should handle error cases gracefully", () => {
      const invalidId = "abc";
      const invalidEmail = "not-an-email";

      const parsedId = parseInteger(invalidId);
      const isValidEmail = validateEmail(invalidEmail);

      expect(parsedId.isValid).toBe(false);
      expect(isValidEmail).toBe(false);
    });
  });
});
