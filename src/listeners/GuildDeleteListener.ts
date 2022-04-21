import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import type { Guild } from "discord.js";

@ApplyOptions<ListenerOptions>({
	event: Events.GuildDelete
})
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export class GuildDeleteListener extends Listener<typeof Events.GuildDelete> {
	public async run(guild: Guild) {
		await this.container.prisma.order.deleteMany({
			where: {
				guild: guild.id
			}
		});
		return this.container.stores.get("webhooks").get("guild").sendGuild(guild, false);
	}
}
