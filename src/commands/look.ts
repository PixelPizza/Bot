import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../Command";

@ApplyOptions<CommandOptions>({
	description: "Look at an order"
})
export class LookCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("order").setDescription("The ID of the order").setRequired(true)
			)
		);
	}

	private formatDate(date: Date) {
		return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} (dd-mm-YYYY)`;
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const orderId = interaction.options.getString("order", true);
		const order = await this.container.stores.get("models").get("order").findByPk(orderId);

		if (!order) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed({
						color: "RED",
						title: "Order not found",
						description: `Order with ID \`${orderId}\` not found`
					})
				]
			});
		}

		const { client } = this.container;
		const customer = await client.users.fetch(order.getDataValue("customer"));
		const guild = await client.guilds.fetch(order.getDataValue("guild"));
		const channel = await guild.channels.fetch(order.getDataValue("channel"));
		const cookedAt = order.getDataValue("cookedAt");
		const deliveredAt = order.getDataValue("deliveredAt");
		const chefId = order.getDataValue("chef");
		const chef = chefId ? await client.users.fetch(chefId) : null;
		const delivererId = order.getDataValue("deliverer");
		const deliverer = delivererId ? await client.users.fetch(delivererId) : null;
		const deliveryMethod = order.getDataValue("deliveryMethod");
		const image = order.getDataValue("image");

		const embed = new MessageEmbed({
			color: "BLUE",
			title: "Order",
			description: order.getDataValue("order"),
			fields: [
				{
					name: "\u200b",
					value: "\u200b"
				},
				{
					name: "Customer",
					value: `${customer.tag} (${customer.id})`
				},
				{
					name: "Guild",
					value: `${guild.name}`,
					inline: true
				},
				{
					name: "Channel",
					value: channel ? `${channel.name}` : "Unknown",
					inline: true
				},
				{
					name: "\u200b",
					value: "\u200b"
				},
				{
					name: "Ordered At",
					value: this.formatDate(order.getDataValue("orderedAt"))
				},
				{
					name: "Cooked At",
					value: cookedAt ? this.formatDate(cookedAt) : "Not yet cooked"
				},
				{
					name: "Delivered At",
					value: deliveredAt ? this.formatDate(deliveredAt) : "Not yet delivered"
				},
				{
					name: "\u200b",
					value: "\u200b"
				}
			],
			footer: {
				text: `ID: ${orderId} | status: ${order.getDataValue("status")}${
					deliveryMethod ? ` | method: ${deliveryMethod}` : ""
				}${chef ? ` | chef: ${chef.tag}` : ""}${deliverer ? ` | deliverer: ${deliverer.tag}` : ""}`
			}
		});

		if (cookedAt) embed.addField("Cooked At", this.formatDate(cookedAt));
		if (deliveredAt) embed.addField("Delivered At", this.formatDate(deliveredAt));
		if (image) embed.setImage(image);

		return interaction.editReply({ embeds: [embed] });
	}
}
