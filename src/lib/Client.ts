import { container, LogLevel, SapphireClient } from "@sapphire/framework";

export class Client<
	Ready extends boolean = boolean
> extends SapphireClient<Ready> {
	public constructor(
		inDevelopment: boolean = container.env.isNodeEnvEqualTo("development")
	) {
		super({
			intents: [],
			logger: {
				level: inDevelopment ? LogLevel.Debug : LogLevel.Info
			}
		});
	}
}
