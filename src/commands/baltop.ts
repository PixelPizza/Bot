import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Show the balance leaderboard",
	cooldownDelay: Time.Minute
})
export class BaltopCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand, {
			idHints: ["992383498998513724", "974010008058617866"]
		});
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const topUsers = await this.getModel("user").findMany({
			take: 10,
			orderBy: {
				balance: "desc"
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
