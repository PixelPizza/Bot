import "@kaname-png/plugin-env/register";
import "@sapphire/plugin-logger/register";
import "@sapphire/plugin-api/register";
import "@devtomio/plugin-botlist/register";
import { join } from "node:path";
import { config } from "dotenv";
import { ApplicationCommandRegistries, container, LogLevel, RegisterBehavior } from "@sapphire/framework";
import { Client } from "./lib/Client";
import { PrismaHookManagerStore } from "./lib/stores/PrismaHookManagerStore";
import { PrismaModelManagerStore } from "./lib/stores/PrismaModelManagerStore";
import { WebhookManagerStore } from "./lib/stores/WebhookManagerStore";
import "./container";
import { EnvClient } from "@kaname-png/plugin-env";
import { Logger } from "./logger";
import ngrok from "ngrok";
config();

async function main() {
	// Options can be configured in src/lib/Client.ts
	const client = new Client();

	ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

	client.stores
		.register(new PrismaHookManagerStore().registerPath(join(__dirname, "hooks")))
		.register(new PrismaModelManagerStore().registerPath(join(__dirname, "models")))
		.register(new WebhookManagerStore().registerPath(join(__dirname, "webhooks")));

	await client.login(new EnvClient({}).string("DISCORD_TOKEN"));

	container.logger = new Logger(container, { level: LogLevel.Debug });

	container.logger.debug("ngrok url", await ngrok.connect(container.env.integer("API_PORT")));
}

void main().finally(() => void container.prisma.$disconnect());
