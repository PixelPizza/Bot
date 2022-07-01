import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Guild } from "discord.js";

@ApplyOptions<Listener.Options>({
	event: Events.GuildDelete
})
export class GuildDeleteListener extends Listener<typeof Events.GuildDelete> {
	public async run(guild: Guild) {
		await this.container.stores
			.get("models")
			.get("order")
			.deleteMany({
				where: {
					guild: guild.id
				}
			});
		return this.container.stores.get("webhooks").get("guild").sendGuild(guild, false);
	}
}
