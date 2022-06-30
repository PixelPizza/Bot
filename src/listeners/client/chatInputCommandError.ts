import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommandErrorPayload, Events, Listener } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

@ApplyOptions<Listener.Options>({
	event: Events.ChatInputCommandError
})
export class ChatInputCommandErrorListener extends Listener<typeof Events.ChatInputCommandError> {
	public run(error: Error, { interaction }: ChatInputCommandErrorPayload): unknown {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		return (interaction.deferred || interaction.replied ? interaction.editReply : interaction.reply).call(
			interaction,
			{
				embeds: [new MessageEmbed().setColor("RED").setTitle("Error").setDescription(error.message)]
			}
		);
	}
}
