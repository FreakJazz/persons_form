/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL?: string;
	readonly VITE_API_BASE_URL?: string;
	readonly VITE_ENVIRONMENT?: 'development' | 'production' | 'test' | string;
	readonly VITE_APP_NAME?: string;
	readonly VITE_VERSION?: string;
	readonly VITE_DEBUG?: string | boolean;
	readonly VITE_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error' | string;
	readonly VITE_ENABLE_ANALYTICS?: string | boolean;
	readonly VITE_ENABLE_ERROR_REPORTING?: string | boolean;
	readonly VITE_TOKEN_STORAGE_KEY?: string;
	readonly VITE_REFRESH_TOKEN_STORAGE_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
