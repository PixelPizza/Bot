import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, type ListenerOptions } from "@sapphire/framework";
import type { Client } from "discord.js";

@ApplyOptions<ListenerOptions>({
	once: true,
	event: Events.ClientReady
})
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export class ReadyListener extends Listener<typeof Events.ClientReady> {
	public run(client: Client<true>) {
		const { tag, id } = client.user;
		client.user.setActivity({ name: `orders get made`, type: "WATCHING" });
		this.container.logger.info(`Successfully logged in as ${tag} (${id})`);
	}
}
