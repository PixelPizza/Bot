import { randomInt } from "node:crypto";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { EmbedBuilder, Colors, type ChatInputCommandInteraction } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Order some food",
	requiredClientPermissions: ["CreateInstantInvite"],
	preconditions: ["GuildOnly", "GuildTextOnly", "NoOrder", "MaxOrders", "EnoughMoney"],
	cooldownDelay: Time.Hour
})
export class OrderCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("order").setDescription("The order you want to place").setRequired(true)
			),
			{
				idHints: ["992383677461970994", "946548214050455552"]
			}
		);
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		await this.getModel("user").update({
			where: { id: interaction.user.id },
			data: {
				balance: {
					decrement: this.container.env.integer("ORDER_PRICE")
				}
			}
		});

		const order = interaction.options.getString("order", true);
		const id = await this.generateOrderID();

		await this.orderModel.create({
			data: {
				id,
				order,
				customer: interaction.user.id,
				guild: interaction.guildId!,
				channel: interaction.channelId
			}
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

	private async generateOrderID() {
		const orders = this.getModel("order");
		let id: string;
		do {
			id = `00${randomInt(0, 999)}`.slice(-3);
		} while (await orders.findUnique({ where: { id } }));
		return id;
	}
}
