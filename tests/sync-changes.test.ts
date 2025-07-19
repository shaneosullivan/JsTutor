import { describe, it, expect, beforeEach, afterEach } from "bun:test";

// Extract utility functions from sync-changes.ts for testing
// Since these involve caching and client-side logic, we'll test the pure functions

function generateCacheKey(
  options: { types?: string[]; courseId?: string },
  accountId: string
): string {
  const types =
    options.types && options.types.length > 0
      ? options.types.sort().join(",")
      : "all";
  const courseId = options.courseId || "all";
  return `${accountId}:${types}:${courseId}`;
}

function buildQueryParams(
  accountId: string,
  options: {
    types?: string[];
    courseId?: string;
  }
): string {
  const params = new URLSearchParams({
    accountId: accountId
  });

  if (options.types && options.types.length > 0) {
    params.append("types", options.types.join(","));
  }

  if (options.courseId !== undefined) {
    params.append("courseId", options.courseId);
  }

  return params.toString();
}

function parseAccountId(accountId: string): {
  isValid: boolean;
  cleaned: string;
} {
  const cleaned = accountId.trim();
  const isValid =
    cleaned.length > 0 && !cleaned.includes(" ") && !cleaned.includes("\n");
  return { isValid, cleaned };
}

function parseTutorialId(tutorialIdStr: string): {
  isValid: boolean;
  id: number;
} {
  const trimmed = tutorialIdStr.trim();
  const id = parseInt(trimmed);
  const isValid = !isNaN(id) && id > 0 && trimmed === id.toString();
  return { isValid, id };
}

function generateTutorialCodeId(profileId: string, tutorialId: number): string {
  return `${profileId}_${tutorialId}`;
}

describe("sync-changes utilities", () => {
  describe("generateCacheKey", () => {
    it("should generate basic cache keys correctly", () => {
      expect(generateCacheKey({}, "account123")).toBe("account123:all:all");
      expect(generateCacheKey({ types: ["profile"] }, "user456")).toBe(
        "user456:profile:all"
      );
      expect(generateCacheKey({ courseId: "basics" }, "test789")).toBe(
        "test789:all:basics"
      );
    });

    it("should handle multiple types with sorting", () => {
      expect(
        generateCacheKey({ types: ["course", "profile", "account"] }, "user1")
      ).toBe("user1:account,course,profile:all");
      expect(generateCacheKey({ types: ["profile", "account"] }, "user2")).toBe(
        "user2:account,profile:all"
      );
    });

    it("should handle types and courseId together", () => {
      expect(
        generateCacheKey(
          { types: ["course"], courseId: "javascript" },
          "acc123"
        )
      ).toBe("acc123:course:javascript");
      expect(
        generateCacheKey(
          { types: ["profile", "course"], courseId: "typescript" },
          "acc456"
        )
      ).toBe("acc456:course,profile:typescript");
    });

    it("should handle empty types array", () => {
      expect(generateCacheKey({ types: [] }, "empty")).toBe("empty:all:all");
      expect(generateCacheKey({ types: [], courseId: "test" }, "empty2")).toBe(
        "empty2:all:test"
      );
    });

    it("should handle special characters in accountId and courseId", () => {
      expect(
        generateCacheKey({ courseId: "web-development" }, "user-123")
      ).toBe("user-123:all:web-development");
      expect(generateCacheKey({ courseId: "html5" }, "user_456")).toBe(
        "user_456:all:html5"
      );
    });

    it("should produce deterministic results for same inputs", () => {
      const options = { types: ["course", "profile"], courseId: "basics" };
      const accountId = "test-account";

      const key1 = generateCacheKey(options, accountId);
      const key2 = generateCacheKey(options, accountId);

      expect(key1).toBe(key2);
      expect(key1).toBe("test-account:course,profile:basics");
    });

    it("should handle numeric courseIds as strings", () => {
      expect(generateCacheKey({ courseId: "123" }, "user1")).toBe(
        "user1:all:123"
      );
      expect(generateCacheKey({ courseId: "0" }, "user2")).toBe("user2:all:0");
    });
  });

  describe("buildQueryParams", () => {
    it("should build basic query parameters", () => {
      const result = buildQueryParams("account123", {});
      expect(result).toBe("accountId=account123");
    });

    it("should include types when provided", () => {
      const result = buildQueryParams("user456", {
        types: ["profile", "course"]
      });
      expect(result).toBe("accountId=user456&types=profile%2Ccourse");
    });

    it("should include courseId when provided", () => {
      const result = buildQueryParams("test789", { courseId: "javascript" });
      expect(result).toBe("accountId=test789&courseId=javascript");
    });

    it("should include both types and courseId", () => {
      const result = buildQueryParams("user1", {
        types: ["account", "profile"],
        courseId: "web-basics"
      });
      expect(result).toBe(
        "accountId=user1&types=account%2Cprofile&courseId=web-basics"
      );
    });

    it("should handle empty types array", () => {
      const result = buildQueryParams("user2", { types: [] });
      expect(result).toBe("accountId=user2");
    });

    it("should URL-encode special characters", () => {
      const result = buildQueryParams("user with spaces", {
        courseId: "course/with/slashes"
      });
      expect(result).toBe(
        "accountId=user+with+spaces&courseId=course%2Fwith%2Fslashes"
      );
    });

    it("should handle numeric-like courseIds", () => {
      const result = buildQueryParams("user123", { courseId: "123" });
      expect(result).toBe("accountId=user123&courseId=123");
    });

    it("should handle single type in array", () => {
      const result = buildQueryParams("single", { types: ["course"] });
      expect(result).toBe("accountId=single&types=course");
    });
  });

  describe("parseAccountId", () => {
    it("should validate correct account IDs", () => {
      expect(parseAccountId("account123")).toEqual({
        isValid: true,
        cleaned: "account123"
      });
      expect(parseAccountId("user-456")).toEqual({
        isValid: true,
        cleaned: "user-456"
      });
      expect(parseAccountId("test_user_789")).toEqual({
        isValid: true,
        cleaned: "test_user_789"
      });
    });

    it("should trim whitespace from account IDs", () => {
      expect(parseAccountId("  account123  ")).toEqual({
        isValid: true,
        cleaned: "account123"
      });
      expect(parseAccountId("\taccount456\t")).toEqual({
        isValid: true,
        cleaned: "account456"
      });
    });

    it("should reject invalid account IDs", () => {
      expect(parseAccountId("")).toEqual({ isValid: false, cleaned: "" });
      expect(parseAccountId("  ")).toEqual({ isValid: false, cleaned: "" });
      expect(parseAccountId("account with spaces")).toEqual({
        isValid: false,
        cleaned: "account with spaces"
      });
      expect(parseAccountId("account\nwith\nnewlines")).toEqual({
        isValid: false,
        cleaned: "account\nwith\nnewlines"
      });
    });

    it("should handle special characters", () => {
      expect(parseAccountId("account@domain.com")).toEqual({
        isValid: true,
        cleaned: "account@domain.com"
      });
      expect(parseAccountId("user+tag")).toEqual({
        isValid: true,
        cleaned: "user+tag"
      });
      expect(parseAccountId("user.name")).toEqual({
        isValid: true,
        cleaned: "user.name"
      });
    });

    it("should handle very long account IDs", () => {
      const longId = "a".repeat(100);
      expect(parseAccountId(longId)).toEqual({
        isValid: true,
        cleaned: longId
      });
    });
  });

  describe("parseTutorialId", () => {
    it("should parse valid tutorial IDs", () => {
      expect(parseTutorialId("1")).toEqual({ isValid: true, id: 1 });
      expect(parseTutorialId("42")).toEqual({ isValid: true, id: 42 });
      expect(parseTutorialId("999")).toEqual({ isValid: true, id: 999 });
    });

    it("should reject invalid tutorial IDs", () => {
      expect(parseTutorialId("")).toEqual({ isValid: false, id: NaN });
      expect(parseTutorialId("abc")).toEqual({ isValid: false, id: NaN });
      expect(parseTutorialId("1.5")).toEqual({ isValid: false, id: 1 });
      expect(parseTutorialId("01")).toEqual({ isValid: false, id: 1 });
    });

    it("should reject zero and negative IDs", () => {
      expect(parseTutorialId("0")).toEqual({ isValid: false, id: 0 });
      expect(parseTutorialId("-1")).toEqual({ isValid: false, id: -1 });
      expect(parseTutorialId("-42")).toEqual({ isValid: false, id: -42 });
    });

    it("should handle whitespace", () => {
      expect(parseTutorialId(" 5 ")).toEqual({ isValid: true, id: 5 }); // Trimmed
      expect(parseTutorialId("5\n")).toEqual({ isValid: true, id: 5 }); // Trimmed, so valid
      expect(parseTutorialId("\t10")).toEqual({ isValid: true, id: 10 }); // Trimmed, so valid
    });

    it("should reject mixed alphanumeric strings", () => {
      expect(parseTutorialId("5a")).toEqual({ isValid: false, id: 5 });
      expect(parseTutorialId("a5")).toEqual({ isValid: false, id: NaN });
      expect(parseTutorialId("1e2")).toEqual({ isValid: false, id: 1 }); // parseInt stops at first non-digit
    });

    it("should handle very large numbers", () => {
      expect(parseTutorialId("999999")).toEqual({ isValid: true, id: 999999 });
      expect(parseTutorialId("1000000")).toEqual({
        isValid: true,
        id: 1000000
      });
    });
  });

  describe("generateTutorialCodeId", () => {
    it("should generate correct tutorial code IDs", () => {
      expect(generateTutorialCodeId("profile123", 1)).toBe("profile123_1");
      expect(generateTutorialCodeId("user-456", 42)).toBe("user-456_42");
      expect(generateTutorialCodeId("test_user", 999)).toBe("test_user_999");
    });

    it("should handle special characters in profile ID", () => {
      expect(generateTutorialCodeId("profile@domain.com", 5)).toBe(
        "profile@domain.com_5"
      );
      expect(generateTutorialCodeId("user+tag", 10)).toBe("user+tag_10");
      expect(generateTutorialCodeId("user.name", 15)).toBe("user.name_15");
    });

    it("should handle large tutorial IDs", () => {
      expect(generateTutorialCodeId("profile", 999999)).toBe("profile_999999");
      expect(generateTutorialCodeId("user", 1000000)).toBe("user_1000000");
    });

    it("should be deterministic", () => {
      const id1 = generateTutorialCodeId("test", 123);
      const id2 = generateTutorialCodeId("test", 123);
      expect(id1).toBe(id2);
      expect(id1).toBe("test_123");
    });

    it("should handle empty profile ID", () => {
      expect(generateTutorialCodeId("", 1)).toBe("_1");
    });

    it("should handle zero tutorial ID", () => {
      expect(generateTutorialCodeId("profile", 0)).toBe("profile_0");
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete sync workflow parameters", () => {
      const accountId = "account-123";
      const options = { types: ["course", "profile"], courseId: "javascript" };

      const cacheKey = generateCacheKey(options, accountId);
      const queryParams = buildQueryParams(accountId, options);
      const accountValidation = parseAccountId(accountId);

      expect(cacheKey).toBe("account-123:course,profile:javascript");
      expect(queryParams).toBe(
        "accountId=account-123&types=course%2Cprofile&courseId=javascript"
      );
      expect(accountValidation).toEqual({
        isValid: true,
        cleaned: "account-123"
      });
    });

    it("should handle tutorial code parsing workflow", () => {
      const profileId = "user_456";
      const tutorialIdStr = "42";

      const tutorialParsing = parseTutorialId(tutorialIdStr);
      if (tutorialParsing.isValid) {
        const codeId = generateTutorialCodeId(profileId, tutorialParsing.id);
        expect(codeId).toBe("user_456_42");
      }

      expect(tutorialParsing.isValid).toBe(true);
    });

    it("should handle error cases in workflow", () => {
      const invalidAccountId = "account with spaces";
      const invalidTutorialId = "abc";

      const accountValidation = parseAccountId(invalidAccountId);
      const tutorialValidation = parseTutorialId(invalidTutorialId);

      expect(accountValidation.isValid).toBe(false);
      expect(tutorialValidation.isValid).toBe(false);
    });

    it("should handle Unicode characters consistently", () => {
      const unicodeAccount = "用户123";
      const unicodeCourse = "课程";

      const cacheKey = generateCacheKey(
        { courseId: unicodeCourse },
        unicodeAccount
      );
      const queryParams = buildQueryParams(unicodeAccount, {
        courseId: unicodeCourse
      });

      expect(cacheKey).toBe("用户123:all:课程");
      expect(queryParams).toContain(encodeURIComponent(unicodeAccount));
      expect(queryParams).toContain(encodeURIComponent(unicodeCourse));
    });
  });
});
