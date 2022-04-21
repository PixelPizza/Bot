import { ApplyOptions } from "@sapphire/decorators";
import { Guild, MessageEmbed } from "discord.js";
import { WebhookManager, WebhookManagerOptions } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManagerOptions>({
    name: "guild",
    webhookName: "Pixel Pizza Guilds",
    channelId: "711196897582383125"
})
export class GuildWebhook extends WebhookManager {
    public sendGuild(guild: Guild, added: boolean) {
        return this.send({
            embeds: [
                new MessageEmbed()
                    .setColor(added ? "GREEN" : "RED")
                    .setTitle(added ? "Added" : "Removed")
                    .setDescription(`${this.container.client.user!.username} has been ${added ? "added to" : "removed from"} the guild ${guild.name}`)
                    .setFooter({ text: guild.id })
                    .setTimestamp()
            ],
            username: guild.name,
            avatarURL: guild.iconURL() ?? this.container.client.user!.displayAvatarURL()
        });
    }
}