import { Sequelize } from "sequelize";

export declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string;
			INVITE_CHANNEL: string;
			ECO_EMOJI: string;
		}
	}
}

declare module "@sapphire/pieces" {
	interface Container {
		database: Sequelize;
	}
}
