import { SapphireClient } from "@sapphire/framework";
import { config } from "dotenv";
config();

const client = new SapphireClient({
	intents: ["GUILDS", "GUILD_MESSAGES"]
});

void client.login(process.env.TOKEN);
