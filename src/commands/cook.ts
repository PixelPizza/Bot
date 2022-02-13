import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";
import { Op } from "sequelize";

@ApplyOptions<Command.Options>({
	description: "Cook an order",
	preconditions: ["ChefOnly", "ValidOrderData"]
})
export class CookCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand
				.addStringOption((input) => input.setName("order").setRequired(true).setDescription("The order to cook").setAutocomplete(true))
				.addStringOption((input) =>
					input.setName("image").setRequired(true).setDescription("The url of the image to use")
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
				chef: interaction.user.id,
				status: "uncooked"
			},
			order: [["id", "ASC"]]
		}));
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply();

		const order = await this.getOrder(interaction, { chef: interaction.user.id });
		const image = interaction.options.getString("image", true);

		if (!this.isImage(image)) {
			throw new Error("The image you specified is not a valid image.");
		}

		await interaction.editReply({
			embeds: [
				new MessageEmbed({
					color: "DARK_GREEN",
					title: "Cooking order",
					description: `Cooking order ${order.id}`
				})
			]
		});

		const imageMessage = (await this.container.stores.get("webhooks").get("image").sendImage(image))!;

		await order.update({
			image: imageMessage.attachments.first()!.url,
			status: "cooked",
			cookedAt: new Date()
		});

		await order.sendCustomerMessage({
			embeds: [
				new MessageEmbed({
					color: "BLUE",
					title: "Order cooked",
					description: `Your order ${order.id} has been cooked.`
				})
			]
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed({
					color: "GREEN",
					title: "Order cooked",
					description: `Order ${order.id} has been cooked.`
				})
			]
		});
	}
}
