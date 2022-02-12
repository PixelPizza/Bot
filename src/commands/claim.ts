import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import { type AutocompleteInteraction, type CommandInteraction, MessageEmbed } from "discord.js";
import { Op } from "sequelize";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<CommandOptions>({
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
				[Op.or]: {
					id: {
						[Op.startsWith]: focused
					},
					order: {
						[Op.substring]: focused
					}
				},
				status: {
					[Op.or]: ["uncooked", "cooked"]
				}
			}
		}));
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		await interaction.deferReply();

		const order = (await this.getOrder(interaction))!;
		const claimType = interaction.options.getString("type", true) as Command.ClaimType;
		const isCookClaim = claimType === Command.ClaimType.Cooking;

		if (isCookClaim ? order.chef : order.deliverer) {
			throw new Error("The order you specified has already been claimed");
		}

		const { id: userId } = interaction.user;
		await order.update(isCookClaim ? { chef: userId } : { deliverer: userId });

		await order.sendCustomerMessage({
			embeds: [
				new MessageEmbed({
					color: "BLUE",
					title: "Order claimed",
					description: `Your order has been claimed by ${interaction.user.tag} for ${claimType}`
				})
			]
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed({
					color: "BLUE",
					title: "Order claimed",
					description: `You claimed order \`${order.id}\` for ${claimType}`
				})
			]
		});
	}
}
