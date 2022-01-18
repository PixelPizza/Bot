import { ApplyOptions } from "@sapphire/decorators";
import { type ApplicationCommandRegistry, type CommandOptions, Events } from "@sapphire/framework";
import { type AutocompleteInteraction, type CommandInteraction, MessageEmbed } from "discord.js";
import { Op } from "sequelize";
import { Command } from "../Command";

enum ClaimType {
	Cooking = "cooking",
	Delivery = "delivery"
}

@ApplyOptions<CommandOptions>({
	description: "Unclaim an order",
	preconditions: [["ChefOnly"], ["DelivererOnly"]]
})
export class UnclaimCommand extends Command {
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
						.addChoices(Object.keys(ClaimType).map((type) => [type, ClaimType[type as keyof typeof ClaimType]]))
				)
		);
	}

	public override async autocompleteRun(interaction: AutocompleteInteraction) {
		const focused = interaction.options.getFocused() as string;
		const found = await this.container.stores
			.get("models")
			.get("order")
			.findAll({
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
			});
		return interaction.respond(
			found
				.map((order) => {
					const id = order.getDataValue("id");
					return { name: `${id} - ${order.getDataValue("order")}`, value: id };
				})
		);
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		const claimType = interaction.options.getString("type", true);
		const isCookClaim = claimType === ClaimType.Cooking;
		const result = await this.container.stores.get("preconditions").get(isCookClaim ? "ChefOnly" : "DelivererOnly")!
			.chatInputRun!(interaction, this, { external: true });

		if (!result.success) {
			return this.container.client.emit(Events.ChatInputCommandDenied, result.error, {
				interaction,
				command: this,
				context: {
					commandId: interaction.commandId,
					commandName: interaction.commandName
				}
			});
		}

		await interaction.deferReply();

		const order = await this.container.stores
			.get("models")
			.get("order")
			.findOne({
				where: {
					id: interaction.options.getString("order")
				}
			});

		if (!order) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed({
						color: "RED",
						title: "Order not found",
						description: "The order you specified does not exist"
					})
				]
			});
		}

		if (order.getDataValue(isCookClaim ? "chef" : "deliverer") !== interaction.user.id) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed({
						color: "RED",
						title: "Order not claimed",
						description: "The order you specified has not been claimed by you"
					})
				]
			});
		}

		await order.update(isCookClaim ? { chef: null } : { deliverer: null });

		return interaction.editReply({
			embeds: [
				new MessageEmbed({
					color: "BLUE",
					title: "Order unclaimed",
					description: `You unclaimed order \`${order.getDataValue("id")}\` for ${claimType}`
				})
			]
		});
	}
}
