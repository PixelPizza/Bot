import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { type CommandInteraction, MessageEmbed } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Show the current orders",
	preconditions: [["ChefOnly"], ["DelivererOnly"]]
})
export class OrdersCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(registry, this.defaultChatInputCommand);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const orders = await this.orderModel.findAll();

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
