import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "🖊🍍🍎🖊",
	cooldownDelay: Time.Second * 10
})
export class PPAPCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand, {
			idHints: ["992383685858955314", "946548296837636097"]
		});
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Yellow)
					.setTitle(this.description)
					.setDescription("[Pen Pineapple Apple Pen](https://www.youtube.com/watch?v=Ct6BUPvE2sM)")
					.setImage("https://c.tenor.com/U5jXEmtm8aIAAAAC/ppap-dance.gif")
					.setFooter({ text: "What did you expect?" })
			],
			ephemeral: true
		});
	}
}
