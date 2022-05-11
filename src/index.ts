import "@kaname-png/plugin-env/register";
import "@sapphire/plugin-logger/register";
import "@sapphire/plugin-api/register";
import "@kaname-png/plugin-statcord/register";
import "@devtomio/plugin-botlist/register";
import { join } from "path";
import { ApplicationCommandRegistries, container, LogLevel, RegisterBehavior } from "@sapphire/framework";
import ngrok from "ngrok";
import { Client } from "./lib/Client";
import { PrismaHookManagerStore } from "./lib/stores/PrismaHookManagerStore";
import { PrismaModelManagerStore } from "./lib/stores/PrismaModelManagerStore";
import { WebhookManagerStore } from "./lib/stores/WebhookManagerStore";
import "./container";
import { Logger } from "./logger";

async function main() {
	const client = new Client();

	ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

	client.stores
		.register(new PrismaHookManagerStore().registerPath(join(__dirname, "hooks")))
		.register(new PrismaModelManagerStore().registerPath(join(__dirname, "models")))
		.register(new WebhookManagerStore().registerPath(join(__dirname, "webhooks")));

	await client.login(container.env.string("TOKEN"));

	container.logger = new Logger(container, { level: LogLevel.Debug });

	client.commandsIn(join(__dirname, "commands", "dos"));

	container.logger.debug("ngrok url", await ngrok.connect(container.env.integer("API_PORT")));
}

void main().finally(() => void container.prisma.$disconnect());
