import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { type ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Show the current orders",
	preconditions: [Command.WorkerOnlyPrecondition]
})
export class OrdersCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(registry, this.defaultChatInputCommand, {
			idHints: ["992383682050543686", "992383683258482771", "946548214708985856", "946548215589781555"]
		});
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const orders = await this.orderModel.findMany();

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blue)
					.setTitle("Orders")
					.setDescription(orders.map((order) => `\`${order.id}\``).join(",") || "No orders")
			]
		});
	}
}
