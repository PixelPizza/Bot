import { EnvClient } from "@kaname-png/plugin-env";
import { container, LogLevel } from "@sapphire/framework";
import { Client as DosClient } from "discord-oversimplified";
import { Sequelize } from "sequelize";

export class Client extends DosClient {
	public constructor() {
		// Env client before login
		const env = new EnvClient({});
		super({
			intents: ["GUILDS", "GUILD_MESSAGES"],
			loadMessageCommandListeners: true,
			logger: {
				level: LogLevel.Debug
			},
			databasesEnabled: false,
			env: {
				debug: true
			},
			botList: {
				debug: true,
				clientId: env.string("CLIENT_ID"),
				keys: {
					topGG: env.string("TOPGG_API_KEY"),
					discordBotList: env.string("DBL_API_KEY")
				}
			}
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
