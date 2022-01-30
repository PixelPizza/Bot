import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import { type AutocompleteInteraction, type CommandInteraction, MessageEmbed } from "discord.js";
import { Op } from "sequelize";
import { Command } from "../lib/Command";

@ApplyOptions<CommandOptions>({
	description: "Look at an order"
})
export class LookCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("order").setDescription("The ID of the order").setRequired(true).setAutocomplete(true)
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
					}
				},
				order: [["id", "ASC"]]
			});
		return interaction.respond(
			found
				.sort((orderA, orderB) => {
					const statusA = orderA.getDataValue("status");
					const statusB = orderB.getDataValue("status");
					if (statusA === statusB) return 0;
					if (statusA === "deleted") return 1;
					if (statusB === "deleted") return -1;
					return 0;
				})
				.map((order) => {
					const id = order.getDataValue("id");
					return { name: `${id} - ${order.getDataValue("order")}`, value: id };
				})
		);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const orderId = interaction.options.getString("order", true);
		const order = await this.container.stores.get("models").get("order").findByPk(orderId);

		if (!order) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed({
						color: "RED",
						title: "Order not found",
						description: `Order with ID \`${orderId}\` not found`
					})
				]
			});
		}

		return interaction.editReply({ embeds: [await order.createOrderEmbed()] });
	}
}
