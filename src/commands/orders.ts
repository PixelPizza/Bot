import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Embed, Colors, ChatInputCommandInteraction } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Show the current orders",
	preconditions: [["ChefOnly"], ["DelivererOnly"]]
})
export class OrdersCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(registry, this.defaultChatInputCommand);
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const orders = await this.orderModel.findAll();

		await interaction.editReply({
			embeds: [
				new Embed()
					.setColor(Colors.Blue)
					.setTitle("Orders")
					.setDescription(orders.map((order) => `\`${order.id}\``).join(",") || "No orders")
			]
		});
	}
}
