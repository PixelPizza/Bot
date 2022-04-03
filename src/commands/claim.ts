import { OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { type AutocompleteInteraction, type CommandInteraction, MessageEmbed } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Claim an order",
	preconditions: ["ValidOrderData", "ValidClaimType"]
})
export class ClaimCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand
				.addStringOption((input) => input.setName("order").setDescription("The order to claim").setRequired(true).setAutocomplete(true))
				.addStringOption((input) =>
					input
						.setName("type")
						.setDescription("The type of claim")
						.setRequired(true)
						.addChoices(Object.entries(Command.ClaimType))
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
				status: {
					in: [OrderStatus.UNCOOKED, OrderStatus.COOKED]
				}
			}
		}));
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		await interaction.deferReply();

		const order = await this.getOrder(interaction);
		const claimType = interaction.options.getString("type", true) as Command.ClaimType;
		const isCookClaim = claimType === Command.ClaimType.Cooking;

		if (isCookClaim ? order.chef : order.deliverer) {
			throw new Error("The order you specified has already been claimed");
		}

		const { id: userId } = interaction.user;
		await this.orderModel.update({ where: { id: order.id }, data: isCookClaim ? { chef: userId } : { deliverer: userId } });

		await this.sendCustomerMessage(order, {
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Order claimed")
					.setDescription(`Your order has been claimed by ${interaction.user.tag} for ${claimType}`)
			]
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Order claimed")
					.setDescription(`You claimed order \`${order.id}\` for ${claimType}`)
			]
		});
	}
}
