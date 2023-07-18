import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommandErrorPayload, Events, Listener } from "@sapphire/framework";
import { BaseMessageOptions, Colors, EmbedBuilder } from "discord.js";

@ApplyOptions<Listener.Options>({
	event: Events.ChatInputCommandError
})
export class ChatInputCommandErrorListener extends Listener<typeof Events.ChatInputCommandError> {
	public run(error: Error, { interaction }: ChatInputCommandErrorPayload): unknown {
		const messageOptions: BaseMessageOptions = {
			embeds: [new EmbedBuilder().setColor(Colors.Red).setTitle("Error").setDescription(error.message)]
		};
		return interaction.deferred || interaction.replied ? interaction.editReply(messageOptions) : interaction.reply(messageOptions);
	}
}
