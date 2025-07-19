// API utility functions for extracting data from requests
import { NextRequest } from "next/server";

const CLIENT_ID_COOKIE_NAME = "jstutor_client_id";

// Extract clientId from request cookies
export function getClientIdFromRequest(request: NextRequest): string | null {
  const cookies = request.cookies;
  return cookies.get(CLIENT_ID_COOKIE_NAME)?.value || null;
}

// Extract clientId from cookie header string (fallback)
export function getClientIdFromCookieHeader(
  cookieHeader: string
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === CLIENT_ID_COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

// Extract clientId from request with fallback options
export function extractClientId(request: NextRequest): string | null {
  // First try to get from cookies
  let clientId = getClientIdFromRequest(request);

  // If not found, try cookie header
  if (!clientId) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      clientId = getClientIdFromCookieHeader(cookieHeader);
    }
  }

  return clientId;
}
