import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Show your current balance.",
	cooldownDelay: Time.Minute * 5
})
export class BalanceCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
		registry.registerChatInputCommand(this.defaultChatInputCommand, { idHints: ["955071815913472001"] });
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const user = await this.container.stores.get("models").get("user").findOrCreate(interaction.user.id);

		await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle(`${interaction.user.username}'s balance`)
					.setDescription(
						`${this.container.client.emojis.cache.get(this.container.env.string("ECO_EMOJI"))!.toString()} ${
							user.balance
						}`
					)
			]
		});
	}
}
