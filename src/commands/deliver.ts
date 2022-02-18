import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import { type AutocompleteInteraction, type Guild, type GuildTextBasedChannel, type TextChannel, ThreadChannel, type User, Embed, Colors, ChatInputCommandInteraction } from "discord.js";
import { Op } from "sequelize";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";
import type { Order } from "../lib/models/Order";

@ApplyOptions<Command.Options>({
	description: "Deliver an order",
	preconditions: ["DelivererOnly", "ValidOrderData"]
})
export class DeliverCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand
				.addStringOption((input) => input.setName("order").setDescription("The order to deliver").setRequired(true).setAutocomplete(true))
				.addStringOption((input) =>
					input
						.setName("method")
						.setDescription("The delivery method")
						.setRequired(true)
						.addChoices([
							["Direct Message", Command.DeliveryMethod.DM],
							["Bot", Command.DeliveryMethod.Bot],
							["Personally", Command.DeliveryMethod.Personal]
						])
				)
		);
	}

	public override autocompleteRun(interaction: AutocompleteInteraction) {
		return this.autocompleteOrder(interaction, (focused) => ({
			where: {
				[Op.or]: {
					id: {
						[Op.startsWith]: focused
					},
					order: {
						[Op.substring]: focused
					}
				},
				deliverer: interaction.user.id,
				status: "cooked"
			},
			order: [["id", "ASC"]]
		}));
	}

	private makeDateReplacement(name: string, date: Date) {
		return {
			type: this.makeDateRegex(name),
			replacement: (_s: string, type: string) => {
				switch(type) {
					case "date":
						return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} (dd-mm-YYYY)`;
					case "time":
						return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} (HH:mm:ss)`;
					case "datetime":
					default:
						return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} (dd-mm-YYYY HH:mm:ss)`;
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
					switch(type) {
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
				}
				return `${addition}${parse()}${addition}`;
			}
		};
	}

	private replace(message: string, replacements: {type: string, replacement: string | ((substring: string, ...args: any[]) => string)}[]) {
		replacements.forEach(replacement => message = typeof replacement.replacement === "string" ? message.replace(new RegExp(`{${replacement.type}}`, "g"), replacement.replacement) : message.replace(new RegExp(`{${replacement.type}}`, "g"), replacement.replacement));
		return message;
	}

	private async createDeliveryMessage(message: string, orderModel: Order, escaped: boolean) {
		const chef = await orderModel.fetchChef();
		const deliverer = await orderModel.fetchDeliverer();
		const customer = await orderModel.fetchCustomer();
		const guild = await orderModel.fetchGuild();
		const channel = await orderModel.fetchChannel();
		const inviteChannel = (await this.container.client.channels.fetch(process.env.INVITE_CHANNEL)) as TextChannel;
		const invite = await inviteChannel.createInvite({ maxAge: 0, maxUses: 1, unique: false });
		const guildName = guild ? guild.name : "Unknown Guild";
		return this.replace(message, [
			this.makeUserReplacement("chef", chef, escaped, "Unknown Chef"),
			this.makeUserReplacement("deliverer", deliverer, escaped, "Unknown Deliverer"),
			this.makeUserReplacement("customer", customer, escaped, "Unknown Customer"),
			{
				type: "image",
				replacement: orderModel.image!
			},
			{
				type: "invite",
				replacement: invite.url.replace("https://", "")
			},
			{
				type: "orderID",
				replacement: orderModel.id
			},
			{
				type: "order",
				replacement: orderModel.order
			},
			this.makeDateReplacement("order", orderModel.orderedAt),
			this.makeDateReplacement("cook", orderModel.cookedAt!),
			this.makeDateReplacement("delivery", orderModel.deliveredAt!),
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

	public override async chatInputRun(interaction: ChatInputCommandInteraction): Promise<any> {
		await interaction.deferReply();

		const orderId = interaction.options.getString("order", true);
		const order = await this.getOrder(interaction, { deliverer: interaction.user.id });
		const method = interaction.options.getString("method", true) as Command.DeliveryMethod;

		order.setDataValue("deliveredAt", new Date());

		const deliverer = await this.container.stores.get("models").get("user").findByPk(interaction.user.id);
		const deliveryMessage = await this.createDeliveryMessage(deliverer?.deliveryMessage ?? this.defaultDeliveryMessage, order, method === Command.DeliveryMethod.Personal);
		const guild = await order.fetchGuild();
		const channel = await order.fetchChannel();

		try {
			switch(method) {
				case Command.DeliveryMethod.Personal:
					await this.deliverPersonal(interaction.user, guild!, channel!, deliveryMessage);
					break;
				case Command.DeliveryMethod.DM:
					await order.sendCustomerMessage(deliveryMessage);
					break;
				case Command.DeliveryMethod.Bot:
					await channel!.send(deliveryMessage);
					break;
			}

			await order.update({
				deliveryMethod: method,
				status: "delivered",
				deliveredAt: order.deliveredAt
			});

			if (method !== Command.DeliveryMethod.DM) {
				await order.sendCustomerMessage({
					embeds: [
						new Embed({
							color: Colors.Blue,
							title: "Order Delivered",
							description: `Your order ${method === Command.DeliveryMethod.Bot ? "has been delivered" : "is being delivered"}`
						})
					]
				});
			}

			return await interaction.editReply({
				embeds: [
					new Embed({
						color: Colors.Green,
						title: "Order delivered",
						description: `Order ${orderId} has been delivered.`
					})
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
