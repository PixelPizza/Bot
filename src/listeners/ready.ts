import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import type { Client } from "discord.js";

@ApplyOptions<ListenerOptions>({
	once: true,
	event: "ready"
})
export class ReadyListener extends Listener {
	public run(client: Client<true>) {
		const { tag, id } = client.user;
		this.container.logger.info(`Successfully logged in as ${tag} (${id})`);
	}
}
