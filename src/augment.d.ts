export {};

// Augment dependencies and globals here
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production" | "test";
		}
	}
}
