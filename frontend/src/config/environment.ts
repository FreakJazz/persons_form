// Configuration file for environment variables (Vite)
// Vite exposes envs on import.meta.env and only vars prefixed with VITE_ are exposed to the client.

const {
  VITE_API_URL,
  VITE_API_BASE_URL,
  VITE_ENVIRONMENT,
  VITE_APP_NAME,
  VITE_VERSION,
  VITE_DEBUG,
  VITE_LOG_LEVEL,
  VITE_ENABLE_ANALYTICS,
  VITE_ENABLE_ERROR_REPORTING,
  VITE_TOKEN_STORAGE_KEY,
  VITE_REFRESH_TOKEN_STORAGE_KEY,
} = import.meta.env as ImportMetaEnv;

export const config = {
  // API Configuration
  apiUrl: VITE_API_URL || 'http://localhost:8000',
  apiBaseUrl: VITE_API_BASE_URL || 'http://localhost:8000',

  // Application Configuration
  environment: VITE_ENVIRONMENT || 'development',
  appName: VITE_APP_NAME || 'Person Registration System',
  version: VITE_VERSION || '1.0.0',

  // Debug Configuration
  debug: String(VITE_DEBUG) === 'true',
  logLevel: VITE_LOG_LEVEL || 'info',

  // Feature Flags
  enableAnalytics: String(VITE_ENABLE_ANALYTICS) === 'true',
  enableErrorReporting: String(VITE_ENABLE_ERROR_REPORTING) === 'true',

  // Authentication Configuration
  tokenStorageKey: VITE_TOKEN_STORAGE_KEY || 'auth_token',
  refreshTokenStorageKey: VITE_REFRESH_TOKEN_STORAGE_KEY || 'refresh_token',

  // Computed values
  isDevelopment: VITE_ENVIRONMENT === 'development',
  isProduction: VITE_ENVIRONMENT === 'production',
};

export default config;
