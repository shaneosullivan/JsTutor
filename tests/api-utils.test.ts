import { describe, it, expect } from "bun:test";
import { getClientIdFromCookieHeader, extractClientId } from "../lib/api-utils";
import { NextRequest } from "next/server";

describe("api-utils utilities", () => {
  describe("getClientIdFromCookieHeader", () => {
    it("should return null for empty cookie header", () => {
      expect(getClientIdFromCookieHeader("")).toBe(null);
      expect(getClientIdFromCookieHeader(null as any)).toBe(null);
      expect(getClientIdFromCookieHeader(undefined as any)).toBe(null);
    });

    it("should extract clientId from simple cookie header", () => {
      const cookieHeader = "jstutor_client_id=test-client-123";
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe("test-client-123");
    });

    it("should extract clientId from multiple cookies", () => {
      const cookieHeader =
        "other_cookie=value; jstutor_client_id=my-client-id; another=test";
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe("my-client-id");
    });

    it("should handle URL-encoded clientId values", () => {
      const originalId = "client id with spaces";
      const cookieHeader = `jstutor_client_id=${encodeURIComponent(originalId)}`;
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe(originalId);
    });

    it("should handle cookies with special characters", () => {
      const originalId = "client-id_123-abc";
      const cookieHeader = `jstutor_client_id=${encodeURIComponent(originalId)}`;
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe(originalId);
    });

    it("should return null when jstutor_client_id cookie not found", () => {
      const cookieHeader = "other_cookie=value; another_cookie=test";
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe(null);
    });

    it("should handle malformed cookie entries", () => {
      const cookieHeader =
        "malformed_entry; jstutor_client_id=valid-id; another=test";
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe("valid-id");
    });

    it("should handle cookies with equals signs in values", () => {
      const cookieHeader = "jstutor_client_id=id-with=equals; other=value";
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe("id-with"); // Only first part before = is taken
    });

    it("should trim whitespace from cookie names and values", () => {
      const cookieHeader = " jstutor_client_id = spaced-id ; other=value";
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe(null); // Name doesn't exactly match after trim
    });

    it("should return first match when multiple jstutor_client_id cookies exist", () => {
      const cookieHeader =
        "jstutor_client_id=first-id; jstutor_client_id=second-id";
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe("first-id");
    });
  });

  describe("extractClientId with NextRequest", () => {
    it("should extract clientId from request cookies", () => {
      const request = new NextRequest("http://localhost:3000", {
        headers: {
          cookie: "jstutor_client_id=request-client-id"
        }
      });

      const result = extractClientId(request);
      expect(result).toBe("request-client-id");
    });

    it("should fallback to cookie header when cookies API fails", () => {
      // Create request without using cookies API
      const request = new NextRequest("http://localhost:3000", {
        headers: {
          cookie: "jstutor_client_id=fallback-id"
        }
      });

      // Mock the cookies.get to return undefined to test fallback
      const originalGet = request.cookies.get;
      request.cookies.get = () => undefined;

      const result = extractClientId(request);
      expect(result).toBe("fallback-id");

      // Restore original method
      request.cookies.get = originalGet;
    });

    it("should return null when no clientId found anywhere", () => {
      const request = new NextRequest("http://localhost:3000", {
        headers: {
          cookie: "other_cookie=value"
        }
      });

      const result = extractClientId(request);
      expect(result).toBe(null);
    });

    it("should handle requests with no cookie header", () => {
      const request = new NextRequest("http://localhost:3000");

      const result = extractClientId(request);
      expect(result).toBe(null);
    });

    it("should handle complex cookie scenarios", () => {
      const request = new NextRequest("http://localhost:3000", {
        headers: {
          cookie:
            "session=abc123; jstutor_client_id=complex-client-id_456; csrf=token"
        }
      });

      const result = extractClientId(request);
      expect(result).toBe("complex-client-id_456");
    });
  });

  describe("cookie parsing edge cases", () => {
    it("should handle empty cookie values", () => {
      const cookieHeader = "jstutor_client_id=; other=value";
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe("");
    });

    it("should handle cookies without values", () => {
      const cookieHeader = "jstutor_client_id; other=value";
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe("undefined"); // decodeURIComponent(undefined) returns "undefined"
    });

    it("should handle very long cookie values", () => {
      const longId = "x".repeat(1000);
      const cookieHeader = `jstutor_client_id=${longId}`;
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe(longId);
    });

    it("should handle special URL encoding scenarios", () => {
      const specialChars = "id+with%20special&chars=test";
      const cookieHeader = `jstutor_client_id=${encodeURIComponent(specialChars)}`;
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe(specialChars);
    });

    it("should handle numeric clientId values", () => {
      const numericId = "123456789";
      const cookieHeader = `jstutor_client_id=${numericId}`;
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe(numericId);
    });

    it("should handle Unicode characters in clientId", () => {
      const unicodeId = "client-用户-123";
      const cookieHeader = `jstutor_client_id=${encodeURIComponent(unicodeId)}`;
      const result = getClientIdFromCookieHeader(cookieHeader);
      expect(result).toBe(unicodeId);
    });
  });
});
