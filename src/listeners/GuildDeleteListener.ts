import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import type { Guild } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.GuildDelete
})
export class GuildDeleteListener extends Listener<typeof Events.GuildDelete> {
    public async run(guild: Guild) {
        await this.container.stores.get("models").get("order").destroy({
            where: {
                guild: guild.id
            }
        });
    }
}