import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { Command } from "../lib/commands/Command";
import { OAuth2Scopes } from "discord-api-types/v10";

@ApplyOptions<Command.Options>({
	description: "Invite the bot to your server",
	cooldownDelay: Time.Minute * 5
})
export class InviteCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand, {
			idHints: ["992383591797501952", "946548210778927105"]
		});
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blue)
					.setTitle("Invite")
					.setDescription(
						`Here is the [Pixel Pizza invite link](${this.container.client.generateInvite({
							scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
							permissions: [
								"CreateInstantInvite",
								"EmbedLinks",
								"SendMessages",
								"UseExternalEmojis"
							]
						})})`
					)
			]
		});
	}
}
