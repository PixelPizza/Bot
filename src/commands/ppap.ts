import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "🖊🍍🍎🖊",
	cooldownDelay: Time.Second * 10
})
export class PPAPCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("YELLOW")
					.setTitle(this.description)
					.setDescription("[Pen Pineapple Apple Pen](https://www.youtube.com/watch?v=Ct6BUPvE2sM)")
					.setImage("https://c.tenor.com/U5jXEmtm8aIAAAAC/ppap-dance.gif")
					.setFooter({ text: "What did you expect?" })
			],
			ephemeral: true
		});
	}
}
