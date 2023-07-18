import { EnvClient } from "@kaname-png/plugin-env";
import { LogLevel, SapphireClient } from "@sapphire/framework";

export class Client extends SapphireClient {
	public constructor() {
		// Env client before login
		const env = new EnvClient({});
		super({
			intents: ["Guilds", "GuildMessages"],
			logger: {
				level: LogLevel.Debug
			},
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
