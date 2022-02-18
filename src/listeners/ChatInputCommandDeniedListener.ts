import { ApplyOptions } from "@sapphire/decorators";
import { type ChatInputCommandDeniedPayload, Events, Listener, type ListenerOptions, type UserError } from "@sapphire/framework";
import { Embed, Colors } from "discord.js";

@ApplyOptions<ListenerOptions>({
	event: Events.ChatInputCommandDenied
})
export class ChatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
	public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		return interaction.reply({
			embeds: [
				new Embed({
					color: Colors.Red,
					title: "Command denied",
					description: error.message
				})
			],
			ephemeral: true
		});
	}
}
