import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { ChatInputCommandInteraction, EmbedBuilder, Colors } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "China",
	cooldownDelay: Time.Second * 10
})
export class ChinaCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand, {
			idHints: ["1091373182046441654"]
		});
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Red)
					.setTitle("🇨🇳")
					.setDescription("China")
					.setFooter({ text: "Powered by China" })
			],
			ephemeral: true
		});
	}
}
