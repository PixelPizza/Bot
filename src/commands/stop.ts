import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "stop the bot",
	requiredUserPermissions: ["Administrator"]
})
export class StopCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(registry, this.defaultChatInputCommand, {
			idHints: ["992383692368511047", "992383693907836980", "966796802953199636", "966796803586555944"]
		});
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			embeds: [new EmbedBuilder().setColor(Colors.Green).setTitle("Stopping").setDescription("Stopping the bot")],
			ephemeral: true
		});

		this.container.client.destroy();
		process.exit();
	}
}
