import { Sequelize } from "sequelize";
import type { ModelManagerStore } from "./lib/stores/ModelManagerStore";
import type { WebhookManagerStore } from "./lib/stores/WebhookManagerStore";

export declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string;
			COMMAND_GUILDS: string | string[];
			INVITE_CHANNEL: string;
			IMAGE_CHANNEL: string;
			ORDER_LOG_CHANNEL: string;
			ECO_EMOJI: string;
			CHEF_ROLE: string;
			DELIVERER_ROLE: string;
		}
	}
}

declare module "@sapphire/pieces" {
	interface Container {
		database: Sequelize;
	}

	interface StoreRegistryEntries {
		models: ModelManagerStore;
		webhooks: WebhookManagerStore;
	}
}

declare module "@sapphire/framework" {
	interface Preconditions {
		ChefOnly: never;
		DelivererOnly: never;
		ValidOrderData: never;
	}
}
