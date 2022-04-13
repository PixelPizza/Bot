import { Sequelize } from "sequelize";
import type { ModelManagerStore } from "./lib/stores/PrismaHookManagerStore";
import type { WebhookManagerStore } from "./lib/stores/WebhookManagerStore";

export declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV?: "development" | "production";
		}
	}
}

declare module "@kaname-png/plugin-env" {
	interface EnvKeys {
		TOKEN: never;
		CLIENT_ID: never;
		COMMAND_GUILDS: never;
		MAX_ORDERS: never;
		// Channels
		INVITE_CHANNEL: never;
		IMAGE_CHANNEL: never;
		ORDERS_CHANNEL: never;
		KITCHEN_CHANNEL: never;
		DELIVERY_CHANNEL: never;
		ORDER_LOG_CHANNEL: never;
		// Emojis
		ECO_EMOJI: never;
		// Roles
		CHEF_ROLE: never;
		CHEF_PING_ROLE: never;
		DELIVERER_ROLE: never;
		DELIVERER_PING_ROLE: never;
		// API Keys
		TOPGG_API_KEY: never;
		DBL_API_KEY: never;
		STATCORD_API_KEY: never;
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
		ValidClaimType: never;
		ExistingOrder: never;
		NoOrder: never;
		MaxOrders: never;
		HasOrder: never;
		HasUncookedOrder: never;
	}
}
