import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, Args, CommandOptions } from "@sapphire/framework";
import { type CommandInteraction, type Message, MessageEmbed, type MessageOptions } from "discord.js";
import { Command } from "../lib/Command";

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
					new MessageEmbed({
						color: "BLUE",
						title: "Commands",
						description: this.container.stores
							.get("commands")
							.map((command) => `**${command.name}:** ${command.description}`)
							.join("\n")
					})
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
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("command").setDescription("The command to display").setRequired(false)
			)
		);
	}

	public override async messageRun(message: Message, args: Args) {
		return message.channel.send(this.getReplyOptions(args.finished ? null : await args.pick("string")));
	}

	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(this.getReplyOptions(interaction.options.getString("command")));
	}
}
