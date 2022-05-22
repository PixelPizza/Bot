import { EnvClient } from "@kaname-png/plugin-env";
import { LogLevel } from "@sapphire/framework";
import { Client as SDJSClient } from "@simpledjs/framework";

export class Client extends SDJSClient {
	public constructor() {
		// Env client before login
		const env = new EnvClient({});
		super({
			intents: ["GUILDS", "GUILD_MESSAGES"],
			logger: {
				level: LogLevel.Debug
			},
			databasesEnabled: false,
			env: {
				enabled: true,
				debug: true
			},
			botList: {
				debug: true,
				clientId: env.string("CLIENT_ID"),
				keys: {
					topGG: env.string("TOPGG_API_KEY"),
					discordBotList: env.string("DBL_API_KEY")
				}
			},
			statcord: {
				client_id: env.string("CLIENT_ID"),
				key: env.string("STATCORD_API_KEY"),
				autopost: true,
				debug: true
			},
			api: {
				origin: "*",
				listenOptions: {
					port: env.integer("API_PORT")
				}
			}
		});
	}
}
