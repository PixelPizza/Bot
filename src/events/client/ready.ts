import { Events, Listener } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Client } from "#lib";

@ApplyOptions<Listener.Options>({
	event: Events.ClientReady
})
export class ReadyListener extends Listener<typeof Events.ClientReady> {
	public run(client: Client<true>): void {
		const { tag, id } = client.user;
		this.container.logger.info(`Logged in as ${tag} (${id})`);
	}
}
