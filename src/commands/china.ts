import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { CommandInteraction, MessageEmbed } from "discord.js";
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

	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("RED")
					.setTitle("🇨🇳")
					.setDescription("China")
					.setFooter("Powered by China")
			],
			ephemeral: true
		});
	}
}
