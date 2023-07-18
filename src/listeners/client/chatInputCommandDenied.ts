import { ApplyOptions } from "@sapphire/decorators";
import { type ChatInputCommandDeniedPayload, Events, Listener, type UserError } from "@sapphire/framework";
import { Colors, EmbedBuilder } from "discord.js";

@ApplyOptions<Listener.Options>({
	event: Events.ChatInputCommandDenied
})
export class ChatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
	public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		return interaction.reply({
			embeds: [new EmbedBuilder().setColor(Colors.Red).setTitle("Command denied").setDescription(error.message)],
			ephemeral: true
		});
	}
}
