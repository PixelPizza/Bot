import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { Op } from "sequelize";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<CommandOptions>({
	description: "Look at an order",
	preconditions: [["ChefOnly"], ["DelivererOnly"], "ValidOrderData"]
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
				}
			},
			order: [["id", "ASC"]]
		}), (orders) => orders.sort((orderA, orderB) => {
			const { status: statusA } = orderA;
			const { status: statusB } = orderB;
			if (statusA === statusB) return 0;
			if (statusA === "deleted") return 1;
			if (statusB === "deleted") return -1;
			return 0;
		}));
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		return interaction.editReply({ embeds: [await (await this.getOrder(interaction)).createOrderEmbed()] });
	}
}
