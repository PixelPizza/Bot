import { Sequelize } from "sequelize";
import { ModelStore } from "./ModelStore";

export declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string;
			COMMAND_GUILDS: string | string[];
			INVITE_CHANNEL: string;
			ECO_EMOJI: string;
		}
	}
}

declare module "@sapphire/pieces" {
	interface Container {
		database: Sequelize;
	}

	interface StoreRegistryEntries {
		models: ModelStore;
	}
}
