import { container, LogLevel, SapphireClient } from "@sapphire/framework";
import { Sequelize } from "sequelize";

export class Client extends SapphireClient {
	public constructor() {
		super({
			intents: ["GUILDS", "GUILD_MESSAGES"],
			loadMessageCommandListeners: true,
			logger: {
				level: LogLevel.Debug
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
