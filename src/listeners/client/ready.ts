import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Client } from "discord.js";
import { ActivityType } from "discord-api-types/v10";

@ApplyOptions<Listener.Options>({
	once: true,
	event: Events.ClientReady
})
export class ReadyListener extends Listener<typeof Events.ClientReady> {
	public run(client: Client<true>) {
		const { tag, id } = client.user;
		client.user.setActivity({ name: `orders get made`, type: ActivityType.Watching });
		this.container.logger.info(`Successfully logged in as ${tag} (${id})`);
	}
}
