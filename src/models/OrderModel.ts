import type { Order, PrismaClient } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { MessageEmbed } from "discord.js";
import { PrismaModelManager, PrismaModelManagerOptions } from "../lib/pieces/PrismaModelManager";

@ApplyOptions<PrismaModelManagerOptions<PrismaClient["order"]>>(({ container }) => ({
	name: "order",
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
		if (!channel?.isText()) throw new Error("Invalid channel");
		const chef = order.chef ? await users.fetch(order.chef).catch(() => null) : null;
		const deliverer = order.deliverer ? await users.fetch(order.deliverer).catch(() => null) : null;

		const embed = new MessageEmbed()
			.setColor("BLUE")
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
				text: `ID: ${order.id} | status: ${order.status}${deliveryMethod ? ` | method: ${deliveryMethod}` : ""}${
					chef ? ` | chef: ${chef.tag} (${chef.id})` : ""
				}${deliverer ? ` | deliverer: ${deliverer.tag} (${deliverer.id})` : ""}`
			});

		if (order.cookedAt) embed.addField("Cooked At", container.formatDate(order.cookedAt));
		if (order.deliveredAt) embed.addField("Delivered At", container.formatDate(order.deliveredAt));
		if (order.image) embed.setImage(order.image);

		embed.addField("\u200b", "\u200b");

		return embed;
	}
}
