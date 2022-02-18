import { ApplyOptions } from "@sapphire/decorators";
import { type ChatInputCommandDeniedPayload, Events, Listener, type ListenerOptions, type UserError } from "@sapphire/framework";
import { Colors, EmbedBuilder } from "discord.js";

@ApplyOptions<ListenerOptions>({
	event: Events.ChatInputCommandDenied
})
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export class ChatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
	public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Red)
					.setTitle("Command denied")
					.setDescription(error.message)
			],
			ephemeral: true
		});
	}
}
