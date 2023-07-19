import {
	type ChatInputCommandDeniedPayload,
	Events,
	Listener,
	type UserError
} from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder } from "#lib";

@ApplyOptions<Listener.Options>({
	event: Events.ChatInputCommandDenied
})
export class ChatInputCommandDeniedListener extends Listener<
	typeof Events.ChatInputCommandDenied
> {
	public run(
		error: UserError,
		{ interaction }: ChatInputCommandDeniedPayload
	): unknown {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.error("Command Denied")
					.setDescription(error.message)
			],
			ephemeral: true
		});
	}
}
