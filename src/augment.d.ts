export declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string;
			INVITE_CHANNEL: string;
		}
	}
}
