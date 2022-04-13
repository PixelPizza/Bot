import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { type CommandInteraction, MessageEmbed } from "discord.js";
import { randomInt } from "node:crypto";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Order some food",
	requiredClientPermissions: ["CREATE_INSTANT_INVITE"],
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
		const orders = this.container.prisma.order;
		let id: string;
		do {
			id = `00${randomInt(0, 999)}`.slice(-3);
		} while (await orders.findUnique({ where: { id } }));
		return id;
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

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
				new MessageEmbed()
					.setColor("GREEN")
					.setTitle("Order Placed")
					.setDescription(`Your order has been placed`)
					.addField("Your order", order)
					.setFooter({ text: `ID: ${id}` })
			]
		});
	}
}
