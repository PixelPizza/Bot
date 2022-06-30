import { ApplyOptions } from "@sapphire/decorators";
import { type ChatInputCommandDeniedPayload, Events, Listener, type UserError } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

@ApplyOptions<Listener.Options>({
	event: Events.ChatInputCommandDenied
})
export class ChatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
	public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		return interaction.reply({
			embeds: [new MessageEmbed().setColor("RED").setTitle("Command denied").setDescription(error.message)],
			ephemeral: true
		});
	}
}
