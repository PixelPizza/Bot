import { OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Remove an order",
	preconditions: [["ChefOnly"], ["DelivererOnly"], "ExistingOrder"],
	cooldownDelay: Time.Second * 5
})
export class RemoveCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand
				.addStringOption((input) =>
					input.setName("order").setDescription("The order to remove").setRequired(true).setAutocomplete(true)
				)
				.addStringOption((input) => input.setName("reason").setDescription("The reason to remove").setRequired(true))
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
				status: {
					in: [OrderStatus.UNCOOKED, OrderStatus.COOKED]
				}
			},
			orderBy: {
				id: "asc"
			}
		}));
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply();

		const reason = interaction.options.getString("reason", true);

		const order = await this.getOrder(interaction);

		await this.orderModel.update({
			where: { id: order.id },
			data: {
				status: OrderStatus.DELETED,
				deleteReason: reason
			}
		});

		await this.sendCustomerMessage(order, {
			embeds: [
				new MessageEmbed()
					.setColor("RED")
					.setTitle("Order removed")
					.setDescription(
						"Your order has been removed. if you think your order has been incorrectly removed, please contact a staff member in our server."
					)
					.addField("Reason", reason)
			]
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("GREEN")
					.setTitle("Order removed")
					.setDescription(`Order ${order.id} has been removed`)
					.addField("Reason", reason)
			]
		});
	}
}
