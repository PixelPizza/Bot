import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, Args } from "@sapphire/framework";
import { type CommandInteraction, type Message, MessageEmbed, type MessageOptions } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	aliases: ["commands"],
	description: "Shows a list of commands"
})
export class HelpCommand extends Command {
	private getReplyOptions(commandName: string | null): MessageOptions {
		const command = commandName ? this.container.stores.get("commands").get(commandName) : null;

		if (!command) {
			return {
				embeds: [
					new MessageEmbed()
						.setColor("BLUE")
						.setTitle("Commands")
						.setDescription(this.container.stores
							.get("commands")
							.map((command) => `**${command.name}:** ${command.description}`)
							.join("\n"))
				]
			};
		}

		const embed = new MessageEmbed()
			.setColor("BLUE")
			.addField("Name", command.name);

		command.aliases.length && embed.addField("Aliases", command.aliases.join(", "));
		(command.detailedDescription || command.description) &&
			embed.addField("Description", command.detailedDescription as string || command.description);

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
