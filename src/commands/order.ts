import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Colors, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { randomInt } from "node:crypto";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Order some food",
	requiredClientPermissions: [PermissionFlagsBits.CreateInstantInvite],
	preconditions: ["GuildOnly", "GuildTextOnly", "NoOrder", "MaxOrders"]
})
export class OrderCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("order").setDescription("The order you want to place").setRequired(true)
			)
		);
	}

	private async generateOrderID() {
		const orders = this.container.stores.get("models").get("order");
		let id: string;
		do {
			id = `00${randomInt(0, 999)}`.slice(-3);
		} while (await orders.findByPk(id));
		return id;
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const order = interaction.options.getString("order", true);
		const id = await this.generateOrderID();

		await this.orderModel.create({
			id,
			order,
			customer: interaction.user.id,
			guild: interaction.guildId!,
			channel: interaction.channelId
		});

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Green)
					.setTitle("Order Placed")
					.setDescription(`Your order has been placed`)
					.addFields({ name: "Your order", value: order })
					.setFooter({ text: `ID: ${id}` })
			]
		});
	}
}
