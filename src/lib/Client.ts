import { container, LogLevel } from "@sapphire/framework";
import { Client as DosClient } from "discord-oversimplified";
import { IntentsBitField } from "discord.js";
import { Sequelize } from "sequelize";

export class Client extends DosClient {
	public constructor() {
		super({
			intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
			loadMessageCommandListeners: true,
			logger: {
				level: LogLevel.Debug
			},
			databasesEnabled: false
		});

		container.database = new Sequelize({
			dialect: "sqlite",
			storage: "database.sqlite",
			logging: (...msg: unknown[]) => container.logger.info(...msg)
		});
	}

	public override async login(token?: string) {
		await container.database.authenticate();
		return super.login(token);
	}

	public override async destroy() {
		await container.database.close();
		return super.destroy();
	}
}
