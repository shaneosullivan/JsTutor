// Client-side utility for managing clientId cookie
import { nanoid } from "nanoid";

const CLIENT_ID_COOKIE_NAME = "jstutor_client_id";
const CLIENT_ID_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// Generate a new client ID
function generateClientId(): string {
  return nanoid();
}

// Get or create clientId from cookie
export function getClientId(): string {
  if (typeof window === "undefined") {
    return ""; // Server-side, return empty string
  }

  // Check if clientId exists in cookie
  const cookies = document.cookie.split(";");
  let clientId = "";

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === CLIENT_ID_COOKIE_NAME) {
      clientId = decodeURIComponent(value);
      break;
    }
  }

  // If no clientId found, generate and store a new one
  if (!clientId) {
    clientId = generateClientId();
    setClientIdCookie(clientId);
  }

  return clientId;
}

// Set clientId cookie
function setClientIdCookie(clientId: string): void {
  if (typeof window === "undefined") {
    return; // Server-side, do nothing
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + CLIENT_ID_COOKIE_MAX_AGE * 1000);

  document.cookie = `${CLIENT_ID_COOKIE_NAME}=${encodeURIComponent(clientId)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure=${window.location.protocol === "https:"}`;
}

// Initialize clientId on page load
export function initializeClientId(): string {
  return getClientId();
}

// Force refresh clientId (generate new one)
export function refreshClientId(): string {
  const newClientId = generateClientId();
  setClientIdCookie(newClientId);
  return newClientId;
}