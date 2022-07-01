import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Client } from "discord.js";

@ApplyOptions<Listener.Options>({
	once: true,
	event: Events.ClientReady
})
export class ReadyListener extends Listener<typeof Events.ClientReady> {
	public run(client: Client<true>) {
		const { tag, id } = client.user;
		client.user.setActivity({ name: `orders get made`, type: "WATCHING" });
		this.container.logger.info(`Successfully logged in as ${tag} (${id})`);
	}
}
