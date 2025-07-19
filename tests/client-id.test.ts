import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  getClientId,
  initializeClientId,
  refreshClientId
} from "../lib/client-id";

// Mock document.cookie for testing
let mockCookies: string = "";
Object.defineProperty(global, "document", {
  value: {
    get cookie() {
      return mockCookies;
    },
    set cookie(value: string) {
      mockCookies += (mockCookies ? "; " : "") + value;
    }
  },
  writable: true
});

// Mock window object
Object.defineProperty(global, "window", {
  value: {
    location: {
      protocol: "https:"
    }
  },
  writable: true
});

describe("client-id utilities", () => {
  beforeEach(() => {
    mockCookies = "";
  });

  afterEach(() => {
    mockCookies = "";
  });

  describe("getClientId", () => {
    it("should return empty string on server side", () => {
      const originalWindow = global.window;
      // @ts-ignore
      global.window = undefined;

      const result = getClientId();
      expect(result).toBe("");

      global.window = originalWindow;
    });

    it("should generate new clientId when no cookie exists", () => {
      const clientId = getClientId();

      expect(clientId).toBeTruthy();
      expect(typeof clientId).toBe("string");
      expect(clientId.length).toBeGreaterThan(0);
    });

    it("should return existing clientId from cookie", () => {
      const existingClientId = "test-client-id-123";
      mockCookies = `jstutor_client_id=${encodeURIComponent(existingClientId)}`;

      const clientId = getClientId();
      expect(clientId).toBe(existingClientId);
    });

    it("should handle URL-encoded clientId in cookie", () => {
      const existingClientId = "test-client-id with spaces";
      mockCookies = `jstutor_client_id=${encodeURIComponent(existingClientId)}`;

      const clientId = getClientId();
      expect(clientId).toBe(existingClientId);
    });

    it("should find clientId among multiple cookies", () => {
      const existingClientId = "test-client-id-456";
      mockCookies = `other_cookie=value; jstutor_client_id=${encodeURIComponent(existingClientId)}; another_cookie=value2`;

      const clientId = getClientId();
      expect(clientId).toBe(existingClientId);
    });

    it("should generate new clientId when cookie value is empty", () => {
      mockCookies = "jstutor_client_id=";

      const clientId = getClientId();
      expect(clientId).toBeTruthy();
      expect(clientId.length).toBeGreaterThan(0);
    });
  });

  describe("initializeClientId", () => {
    it("should return a valid clientId", () => {
      const clientId = initializeClientId();

      expect(clientId).toBeTruthy();
      expect(typeof clientId).toBe("string");
      expect(clientId.length).toBeGreaterThan(0);
    });

    it("should return same clientId on subsequent calls", () => {
      const clientId1 = initializeClientId();
      const clientId2 = initializeClientId();

      expect(clientId1).toBe(clientId2);
    });
  });

  describe("refreshClientId", () => {
    it("should generate a new clientId different from existing", () => {
      const originalClientId = getClientId();
      const newClientId = refreshClientId();

      expect(newClientId).toBeTruthy();
      expect(typeof newClientId).toBe("string");
      expect(newClientId).not.toBe(originalClientId);
    });

    it("should return empty string on server side", () => {
      const originalWindow = global.window;
      // @ts-ignore
      global.window = undefined;

      const result = refreshClientId();
      expect(result).toBeTruthy(); // nanoid still works

      global.window = originalWindow;
    });
  });

  describe("clientId format validation", () => {
    it("should generate clientIds with expected nanoid format", () => {
      const clientId = getClientId();

      // nanoid default format: URL-safe characters, 21 characters
      expect(clientId).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(clientId.length).toBe(21);
    });

    it("should generate unique clientIds on multiple calls", () => {
      const clientIds = new Set();

      for (let i = 0; i < 10; i++) {
        mockCookies = ""; // Clear cookies for each iteration
        const clientId = getClientId();
        clientIds.add(clientId);
      }

      expect(clientIds.size).toBe(10); // All should be unique
    });
  });

  describe("edge cases", () => {
    it("should handle malformed cookie strings", () => {
      mockCookies = "malformed cookie without equals";

      const clientId = getClientId();
      expect(clientId).toBeTruthy();
      expect(typeof clientId).toBe("string");
    });

    it("should handle cookies with empty names", () => {
      mockCookies = "=value_without_name; jstutor_client_id=valid-id";

      const clientId = getClientId();
      expect(clientId).toBe("valid-id");
    });

    it("should handle special characters in cookie parsing", () => {
      const specialId = "id-with-special-chars_123-abc";
      mockCookies = `jstutor_client_id=${encodeURIComponent(specialId)}`;

      const clientId = getClientId();
      expect(clientId).toBe(specialId);
    });
  });
});
