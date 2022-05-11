import { DeliveryMethod, Order, OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import {
	type AutocompleteInteraction,
	type CommandInteraction,
	type Guild,
	type GuildTextBasedChannel,
	type TextChannel,
	ThreadChannel,
	type User,
	MessageEmbed
} from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Deliver an order",
	preconditions: ["DelivererOnly", "ValidOrderData"]
})
export class DeliverCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand
				.addStringOption((input) =>
					input.setName("order").setDescription("The order to deliver").setRequired(true).setAutocomplete(true)
				)
				.addStringOption((input) =>
					input
						.setName("method")
						.setDescription("The delivery method")
						.setRequired(true)
						.addChoices([
							["Direct Message", DeliveryMethod.DM],
							["Bot", DeliveryMethod.BOT],
							["Personally", DeliveryMethod.PERSONAL]
						])
				)
		);
	}

	public override autocompleteRun(interaction: AutocompleteInteraction) {
		return this.autocompleteOrder(interaction, (focused) => ({
			where: {
				OR: {
					id: {
						startsWith: focused
					},
					order: {
						contains: focused
					}
				},
				deliverer: interaction.user.id,
				status: OrderStatus.COOKED
			},
			orderBy: {
				id: "asc"
			}
		}));
	}

	private makeDateReplacement(name: string, date: Date) {
		return {
			type: this.makeDateRegex(name),
			replacement: (_s: string, type: string) => {
				switch (type) {
					case "date":
						return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} (dd-mm-YYYY)`;
					case "time":
						return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} (HH:mm:ss)`;
					case "datetime":
					default:
						return `${date.getDate()}-${
							date.getMonth() + 1
						}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} (dd-mm-YYYY HH:mm:ss)`;
				}
			}
		};
	}

	private makeUserReplacement(name: string, user: User | null, escaped: boolean, defaultValue: string) {
		return {
			type: this.makeUserRegex(name),
			replacement: (_s: string, type: string) => {
				const addition = escaped ? "`" : "";
				const parse = () => {
					if (!user) return defaultValue;
					switch (type) {
						default:
						case "tag":
							return user.tag;
						case "id":
							return user.id;
						case "name":
						case "username":
							return user.username;
						case "ping":
						case "mention":
							return user.toString();
					}
				};
				return `${addition}${parse()}${addition}`;
			}
		};
	}

	private replace(
		message: string,
		replacements: { type: string; replacement: string | ((substring: string, ...args: any[]) => string) }[]
	) {
		replacements.forEach(
			(replacement) =>
				(message =
					typeof replacement.replacement === "string"
						? message.replace(new RegExp(`{${replacement.type}}`, "g"), replacement.replacement)
						: message.replace(new RegExp(`{${replacement.type}}`, "g"), replacement.replacement))
		);
		return message;
	}

	private async createDeliveryMessage(message: string, order: Order, escaped: boolean) {
		const chef = order.chef ? await this.container.client.users.fetch(order.chef).catch(() => null) : null;
		const deliverer = order.deliverer
			? await this.container.client.users.fetch(order.deliverer).catch(() => null)
			: null;
		const customer = await this.container.client.users.fetch(order.customer).catch(() => null);
		const guild = await this.container.client.guilds.fetch(order.guild).catch(() => null);
		const channel = (await guild?.channels.fetch(order.channel).catch(() => null)) ?? null;
		const inviteChannel = (await this.container.client.channels.fetch(
			this.container.env.string("INVITE_CHANNEL")
		)) as TextChannel;
		const invite = await inviteChannel.createInvite({ maxAge: 0, maxUses: 1, unique: false });
		const guildName = guild ? guild.name : "Unknown Guild";
		return this.replace(message, [
			this.makeUserReplacement("chef", chef, escaped, "Unknown Chef"),
			this.makeUserReplacement("deliverer", deliverer, escaped, "Unknown Deliverer"),
			this.makeUserReplacement("customer", customer, escaped, "Unknown Customer"),
			{
				type: "image",
				replacement: order.image!
			},
			{
				type: "invite",
				replacement: invite.url.replace("https://", "")
			},
			{
				type: "orderID",
				replacement: order.id
			},
			{
				type: "order",
				replacement: order.order
			},
			this.makeDateReplacement("order", order.orderedAt),
			this.makeDateReplacement("cook", order.cookedAt!),
			this.makeDateReplacement("delivery", order.deliveredAt!),
			{
				type: "guild",
				replacement: guildName
			},
			{
				type: "server",
				replacement: guildName
			},
			{
				type: "channel",
				replacement: channel ? channel.name : "Unknown Channel"
			}
		]);
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		await interaction.deferReply();

		const orderId = interaction.options.getString("order", true);
		const order = await this.getOrder(interaction, { deliverer: interaction.user.id });
		const method = interaction.options.getString("method", true) as DeliveryMethod;

		order.deliveredAt = new Date();

		const deliverer = await this.getModel("user").findFirst({ where: { id: interaction.user.id } });
		const deliveryMessage = await this.createDeliveryMessage(
			deliverer?.deliveryMessage ?? this.defaultDeliveryMessage,
			order,
			method === DeliveryMethod.PERSONAL
		);
		const guild = await this.container.client.guilds.fetch(order.guild);
		const channel = await guild.channels.fetch(order.channel);

		try {
			switch (method) {
				case DeliveryMethod.PERSONAL:
					if (!channel?.isText()) return;
					await this.deliverPersonal(interaction.user, guild, channel, deliveryMessage);
					break;
				case DeliveryMethod.DM:
					await this.sendCustomerMessage(order, deliveryMessage);
					break;
				case DeliveryMethod.BOT:
					if (!channel?.isText()) return;
					await channel.send(deliveryMessage);
					break;
			}

			await this.orderModel.update({
				data: {
					deliveryMethod: method,
					status: OrderStatus.DELIVERED,
					deliveredAt: order.deliveredAt
				},
				where: { id: order.id }
			});

			if (method !== DeliveryMethod.DM) {
				await this.sendCustomerMessage(order, {
					embeds: [
						new MessageEmbed()
							.setColor("BLUE")
							.setTitle("Order Delivered")
							.setDescription(
								`Your order ${method === DeliveryMethod.BOT ? "has been delivered" : "is being delivered"}`
							)
					]
				});
			}

			return await interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("GREEN")
						.setTitle("Order Delivered")
						.setDescription(`Order ${orderId} has been delivered.`)
				]
			});
		} catch (error) {
			this.container.logger.error("delivery error", error);
			throw new Error(`Order ${orderId} could not be delivered.`);
		}
	}

	private async deliverPersonal(user: User, guild: Guild, channel: GuildTextBasedChannel, message: string) {
		if (channel instanceof ThreadChannel) {
			if (!channel.parent) throw new Error("Invalid channel");
			channel = channel.parent;
		}
		const invite = await guild.invites.create(channel, { maxAge: 0, reason: "Delivering an order" });
		await user.send(message);
		await user.send(stripIndents`
			Don't send this link to the customer!
			${invite.url}
		`);
	}
}
