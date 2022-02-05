import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import { type CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/Command";

@ApplyOptions<CommandOptions>({
	description: "Show the current orders"
})
export class OrdersCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(registry, this.defaultChatInputCommand);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const orders = await this.container.stores.get("models").get("order").findAll();

		await interaction.editReply({
			embeds: [
				new MessageEmbed({
					color: "BLUE",
					title: "Orders",
					description: orders.map((order) => `\`${order.id}\``).join(",") || "No orders"
				})
			]
		});
	}
}
