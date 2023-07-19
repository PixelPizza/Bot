import {
	type ChatInputCommandErrorPayload,
	Events,
	Listener
} from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder } from "#lib";

@ApplyOptions<Listener.Options>({
	event: Events.ChatInputCommandError
})
export class ChatInputCommandErrorListener extends Listener<
	typeof Events.ChatInputCommandError
> {
	public run(
		error: Error,
		{ interaction }: ChatInputCommandErrorPayload
	): unknown {
		const message = {
			embeds: [new EmbedBuilder().error().setDescription(error.message)]
		};
		return interaction.replied || interaction.deferred
			? interaction.editReply(message)
			: interaction.reply(message);
	}
}
