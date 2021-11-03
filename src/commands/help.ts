import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";

@ApplyOptions<CommandOptions>({
	aliases: ["commands"],
	description: "Shows a list of commands"
})
export class HelpCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const commands = this.container.stores.get("commands");
		const command = args.finished ? null : commands.get(await args.pick("string"));

		if (!command) {
			return message.channel.send({
				embeds: [
					{
						color: "BLUE",
						title: "Commands",
						description: commands.map((command) => `**${command.name}:** ${command.description}`).join("\n")
					}
				]
			});
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

		return message.channel.send({
			embeds: [embed]
		});
	}
}
