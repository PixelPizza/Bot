import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

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

	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Invite")
					.setDescription(
						`Here is the [Pixel Pizza invite link](${this.container.client.generateInvite({
							scopes: ["applications.commands", "bot"],
							permissions: [
								"CREATE_INSTANT_INVITE",
								"EMBED_LINKS",
								"SEND_MESSAGES",
								"USE_EXTERNAL_EMOJIS"
							]
						})})`
					)
			]
		});
	}
}
