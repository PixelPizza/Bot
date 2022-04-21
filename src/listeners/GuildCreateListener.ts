import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Guild } from "discord.js";

@ApplyOptions<Listener.Options>({
	event: Events.GuildCreate
})
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export class GuildCreateListener extends Listener<typeof Events.GuildCreate> {
	public run(guild: Guild): unknown {
		return this.container.stores.get("webhooks").get("guild").sendGuild(guild, true);
	}
}
