import type { PrismaModelManagerStore } from "./lib/stores/PrismaModelManagerStore";
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
		DISCORD_TOKEN: never;
		CLIENT_ID: never;
		COMMAND_GUILDS: never;
		BOT_MANAGERS: never;
		API_PORT: never;
		// Order config
		MAX_ORDERS: never;
		ORDER_PRICE: never;
		// Vote config
		VOTE_SECRET: never;
		VOTE_REWARD: never;
		// Work config
		WORK_MIN_REWARD: never;
		WORK_MAX_REWARD: never;
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
		CHEF_ROLES: never;
		CHEF_PING_ROLE: never;
		DELIVERER_ROLES: never;
		DELIVERER_PING_ROLE: never;
		// Webhooks
		CONSOLE_URL: never;
		// API Keys
		TOPGG_API_KEY: never;
		DBL_API_KEY: never;
	}
}

declare module "@sapphire/pieces" {
	interface StoreRegistryEntries {
		models: PrismaModelManagerStore;
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
		NotManager: never;
		HasMoneyAmount: never;
		UserExists: never;
		EnoughMoney: never;
	}
}
