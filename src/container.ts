import { Order, PrismaClient, User } from "@prisma/client";
import { container } from "@sapphire/framework";
import { MessageEmbed } from "discord.js";

declare module "@sapphire/pieces" {
	interface Container {
		prisma: PrismaClient;
		formatDate: (date: Date) => string;
		createOrderEmbed: (order: Order) => Promise<MessageEmbed>;
		findOrCreateUser: (id: string) => Promise<User>;
	}
}

container.prisma = new PrismaClient();
container.formatDate = (date: Date) => `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} (dd-mm-YYYY)`;
container.createOrderEmbed = async (order: Order) => {
	const { users, guilds } = container.client;
	const { deliveryMethod } = order;
	const customer = await users.fetch(order.customer);
	const guild = await guilds.fetch(order.guild);
	const channel = (await await guild.channels.fetch(order.channel)) ?? guild.systemChannel ?? null;
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
};

container.findOrCreateUser = async (id: string) =>
	container.prisma.user.findUnique({ where: { id }, rejectOnNotFound: true })
	.catch(() => container.prisma.user.create({ data: { id } }));
