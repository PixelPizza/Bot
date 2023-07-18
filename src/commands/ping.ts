import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { type ChatInputCommandInteraction, EmbedBuilder, Colors } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Displays the bot ping",
	cooldownDelay: Time.Minute * 5,
	cooldownFilteredUsers: ["472312270047674378"]
})
export class PingCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand, {
			idHints: ["992383684948787260", "946548296464343090"]
		});
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		const reply = await interaction.reply({
			content: "Pinging...",
			fetchReply: true
		});
		const createdTimestamp = reply.createdTimestamp;
		return interaction.editReply({
			content: null,
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Green)
					.setTitle("🏓 Pong!")
					.addFields([
						{
							name: "API Latency",
							value: `${Math.round(this.container.client.ws.ping)}ms`
						},
						{
							name: "Message Latency",
							value: `${createdTimestamp - interaction.createdTimestamp}ms`
						}
					])
			]
		});
	}
}
