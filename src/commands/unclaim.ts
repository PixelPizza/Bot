import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { type AutocompleteInteraction, type CommandInteraction, MessageEmbed } from "discord.js";
import { Op } from "sequelize";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Unclaim an order",
	preconditions: ["ValidClaimType", "ExistingOrder"]
})
export class UnclaimCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void  {
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

	public override async autocompleteRun(interaction: AutocompleteInteraction) {
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
			},
			order: [["id", "ASC"]]
		}));
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		await interaction.deferReply();

		const order = await this.getOrder(interaction);
		const claimType = interaction.options.getString("type", true) as Command.ClaimType;
		const isCookClaim = claimType === Command.ClaimType.Cooking;

		if ((isCookClaim ? order.chef : order.deliverer) !== interaction.user.id) {
			throw new Error("The order you specified has not been claimed by you");
		}

		await order.update(isCookClaim ? { chef: null } : { deliverer: null });

		await order.sendCustomerMessage({
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Order unclaimed")
					.setDescription("Your order has been unclaimed")
			]
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Order unclaimed")
					.setDescription(`You unclaimed order \`${order.id}\` for ${claimType}`)
			]
		});
	}
}
