// Centralized API configuration
// Change this URL to point to your backend server
export const API_BASE_URL = 'https://167-71-58-0.nip.io';

// Derived URLs for different API endpoints
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  SESSIONS: `${API_BASE_URL}/api/sessions`,
  BOT_KNOWLEDGE: `${API_BASE_URL}/api/bot-knowledge`,
  BOT_PLATFORMS: `${API_BASE_URL}/api/platforms`,
  WEBSOCKET: `${API_BASE_URL}/ws`,
  OAUTH_GOOGLE: `${API_BASE_URL}/oauth2/authorization/google`,
} as const;