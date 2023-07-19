import { EnvManager } from "#lib";
import { container } from "@sapphire/framework";
import { config } from "dotenv";
config();

declare module "@sapphire/pieces" {
	interface Container {
		env: EnvManager;
	}
}

container.env = new EnvManager();
