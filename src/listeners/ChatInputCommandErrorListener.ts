import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommandErrorPayload, Events, Listener, ListenerOptions } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.ChatInputCommandError
})
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export class ChatInputCommandErrorListener extends Listener<typeof Events.ChatInputCommandError> {
    public run(error: Error, { interaction }: ChatInputCommandErrorPayload): unknown {
        return (interaction.deferred || interaction.replied ? interaction.editReply : interaction.reply).call(interaction, {
            embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setTitle("Error")
                    .setDescription(error.message)
            ]
        });
    }
}