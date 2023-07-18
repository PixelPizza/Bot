import type { Order, PrismaClient } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Colors, EmbedBuilder } from "discord.js";
import { PrismaModelManager } from "../lib/pieces/PrismaModelManager";

@ApplyOptions<PrismaModelManager.Options<PrismaClient["order"]>>(({ container }) => ({
	prisma: container.prisma.order
}))
export class OrderModel extends PrismaModelManager<PrismaClient["order"]> {
	public async createEmbed(order: Order) {
		const { container } = this;
		const { users, guilds } = container.client;
		const { deliveryMethod } = order;
		const customer = await users.fetch(order.customer);
		const guild = await guilds.fetch(order.guild);
		const channel = (await guild.channels.fetch(order.channel)) ?? guild.systemChannel ?? null;
		if (!channel?.isTextBased()) throw new Error("Invalid channel");
		const chef = order.chef ? await users.fetch(order.chef).catch(() => null) : null;
		const deliverer = order.deliverer ? await users.fetch(order.deliverer).catch(() => null) : null;

		const embed = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setTitle("Order")
			.setDescription(order.order)
			.addFields([
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
					value: guild.name
				},
				{
					name: "Channel",
					value: channel.name
				},
				{
					name: "\u200b",
					value: "\u200b"
				},
				{
					name: "Ordered At",
					value: container.formatDate(order.orderedAt)
				}
			])
			.setFooter({
				text: `ID: ${order.id} | status: ${order.status}${
					deliveryMethod ? ` | method: ${deliveryMethod}` : ""
				}${chef ? ` | chef: ${chef.tag} (${chef.id})` : ""}${
					deliverer ? ` | deliverer: ${deliverer.tag} (${deliverer.id})` : ""
				}`
			});

		if (order.cookedAt) embed.addFields({ name: "Cooked At", value: container.formatDate(order.cookedAt) });
		if (order.deliveredAt) embed.addFields({ name: "Delivered At", value: container.formatDate(order.deliveredAt) });
		if (order.image) embed.setImage(order.image);

		embed.addFields({ name: "\u200b", value: "\u200b" });

		return embed;
	}
}
