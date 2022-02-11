import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import { AutocompleteInteraction, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import { Util } from "../lib/Util";
import { Command } from "../lib/Command";
import { Op } from "sequelize";

@ApplyOptions<CommandOptions>({
	description: "Cook an order",
	preconditions: ["ValidOrderData", "ChefOnly"]
})
export class CookCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		// TODO: change to builder
		this.registerPrivateChatInputCommand(registry, {
			name: this.name,
			description: this.description,
			options: [
				{
					type: "STRING",
					name: "order",
					description: "The order to cook",
					required: true,
					autocomplete: true
				},
				{
					type: "ATTACHMENT",
					name: "image",
					description: "The url of the image to use",
					required: true
				}
			]
		});
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
					chef: interaction.user.id,
					status: "uncooked"
				},
				order: [["id", "ASC"]]
			});
		return interaction.respond(
			found
				.map((order) => {
					const {id} = order;
					return { name: `${id} - ${order.order}`, value: id };
				})
		);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply();

		const orderId = interaction.options.getString("order", true);
		const order = await this.container.stores
			.get("models")
			.get("order")
			.findOne({
				where: {
					id: orderId,
					chef: interaction.user.id
				}
			});

		if (!order) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed({
						color: "RED",
						title: "Invalid order",
						description: "The order you specified does not exist, has not been claimed, or is not claimed by you."
					})
				]
			});
		}

		const image = interaction.options.getAttachment("image", true);

		if (!Util.isImageAttachment(image)) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed({
						color: "RED",
						title: "Invalid image",
						description: "The image you specified is not a valid image."
					})
				]
			});
		}

		await interaction.editReply({
			embeds: [
				new MessageEmbed({
					color: "DARK_GREEN",
					title: "Cooking order",
					description: `Cooking order ${orderId}`
				})
			]
		});

		const imageMessage = await (
			(await this.container.client.channels.fetch(process.env.IMAGE_CHANNEL)) as TextChannel
		).send({ files: [image.url] });

		await order.update({
			image: imageMessage.attachments.first()!.url,
			status: "cooked",
			cookedAt: new Date()
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed({
					color: "GREEN",
					title: "Order cooked",
					description: `Order ${orderId} has been cooked.`
				})
			]
		});
	}
}
