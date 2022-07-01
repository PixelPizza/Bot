import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Give money to another user",
	preconditions: ["UserExists", "HasMoneyAmount"],
	cooldownDelay: Time.Minute
})
export class GiveCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			this.defaultChatInputCommand
				.addUserOption((input) =>
					input.setName("user").setDescription("The user to give money to").setRequired(true)
				)
				.addIntegerOption((input) =>
					input
						.setName("amount")
						.setDescription("The amount of money to give")
						.setRequired(true)
						.setMinValue(1)
				),
			{
				idHints: ["992383590031687710", "974010001733603440"]
			}
		);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const user = interaction.options.getUser("user", true);
		const amount = interaction.options.getInteger("amount", true);

		await this.getModel("user").update({
			where: { id: interaction.user.id },
			data: {
				balance: {
					decrement: amount
				}
			}
		});

		await this.getModel("user").update({
			where: { id: user.id },
			data: {
				balance: {
					increment: amount
				}
			}
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("GREEN")
					.setTitle("Gave money")
					.setDescription(`Gave ${amount} to ${user.toString()}`)
			]
		});
	}
}
