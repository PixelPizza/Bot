import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Args, Command, CommandOptions } from "@sapphire/framework";
import { CommandInteraction, Message, MessageEmbed, MessageOptions } from "discord.js";

@ApplyOptions<CommandOptions>({
	aliases: ["commands"],
	description: "Shows a list of commands"
})
export class HelpCommand extends Command {
	private getReplyOptions(commandName: string | null): MessageOptions {
		const command = commandName ? this.container.stores.get("commands").get(commandName) : null;

		if (!command) {
			return {
				embeds: [
					{
						color: "BLUE",
						title: "Commands",
						description: this.container.stores
							.get("commands")
							.map((command) => `**${command.name}:** ${command.description}`)
							.join("\n")
					}
				]
			};
		}

		const embed = new MessageEmbed({
			color: "BLUE",
			fields: [
				{
					name: "Name",
					value: command.name
				}
			]
		});

		command.aliases.length && embed.addField("Aliases", command.aliases.join(", "));
		(command.detailedDescription || command.description) &&
			embed.addField("Description", command.detailedDescription || command.description);

		return {
			embeds: [embed]
		};
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			new SlashCommandBuilder()
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((input) =>
					input.setName("command").setDescription("The command to display").setRequired(false)
				) as SlashCommandBuilder
		);
	}

	public override async messageRun(message: Message, args: Args) {
		return message.channel.send(this.getReplyOptions(args.finished ? null : await args.pick("string")));
	}

	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(this.getReplyOptions(interaction.options.getString("command")));
	}
}
