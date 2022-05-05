import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Show the balance leaderboard"
})
export class BaltopCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const topUsers = await this.container.prisma.user.findMany({
			take: 10,
			orderBy: {
				balance: "asc"
			}
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Balance Leaderboard")
					.setDescription(topUsers.map((user) => `<@${user.id}> ${user.balance}`).join("\n"))
			]
		});
	}
}
