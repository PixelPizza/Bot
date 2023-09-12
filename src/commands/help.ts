import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { type ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	aliases: ["commands"],
	description: "Shows a list of commands",
	cooldownDelay: Time.Minute * 5
})
export class HelpCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("command").setDescription("The command to display").setRequired(false)
			),
			{
				idHints: ["992383590849577080", "946548210233671730"]
			}
		);
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		const commandName = interaction.options.getString("command");
		const command = commandName ? this.container.stores.get("commands").get(commandName) : null;

		if (!command) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(Colors.Blue)
						.setTitle("Commands")
						.setDescription(
							this.container.stores
								.get("commands")
								.map((command) => `**${command.name}:** ${command.description}`)
								.join("\n")
						)
				]
			});
		}

		const embed = new EmbedBuilder().setColor(Colors.Blue).addFields({ name: "Name", value: command.name });

		command.aliases.length && embed.addFields({ name: "Aliases", value: command.aliases.join(", ") });
		(command.detailedDescription || command.description) &&
			embed.addFields({ name: "Description", value: (command.detailedDescription as string) || command.description });

		return interaction.reply({ embeds: [embed] });
	}
}
