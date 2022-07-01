import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import type { Guild, TextChannel } from "discord.js";

@ApplyOptions<Listener.Options>({
	event: Events.GuildCreate
})
export class GuildCreateListener extends Listener<typeof Events.GuildCreate> {
	public async run(guild: Guild): Promise<unknown> {
		await this.container.stores.get("webhooks").get("guild").sendGuild(guild, true);

		const channel =
			guild.systemChannel ??
			(guild.channels.cache.find((channel) => channel.type === "GUILD_TEXT") as TextChannel);
		return channel.send(stripIndents`
			> Thank you for adding Pixel Pizza!
			> Type / to see my commands.
			>
			> To order food, use /order.
		`);
	}
}
