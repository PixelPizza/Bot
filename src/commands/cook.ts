import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import type { CommandInteraction, TextChannel } from "discord.js";
import { Util } from "../Util";
import { Command } from "../Command";

@ApplyOptions<CommandOptions>({
	description: "Cook an order",
	preconditions: ["ChefOnly"]
})
export class CookCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand
				.addStringOption((input) => input.setName("order").setRequired(true).setDescription("The order to cook"))
				.addStringOption((input) =>
					input.setName("image").setRequired(true).setDescription("The url of the image to use")
				)
		);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const orderId = interaction.options.getString("order", true);
		const order = await this.container.stores
			.get("models")
			.get("order")
			.findOne({
				where: { id: orderId, status: "claimed", chef: interaction.user.id }
			});

		if (!order) {
			return interaction.editReply({
				embeds: [
					{
						color: "RED",
						title: "Invalid order",
						description: "The order you specified does not exist, has not been claimed, or is not claimed by you."
					}
				]
			});
		}

		const image = interaction.options.getString("image", true);

		if (!Util.isImage(image)) {
			return interaction.editReply({
				embeds: [
					{
						color: "RED",
						title: "Invalid image",
						description: "The image you specified is not a valid image."
					}
				]
			});
		}

		await interaction.editReply({
			embeds: [
				{
					color: "DARK_GREEN",
					title: "Cooking order",
					description: `Cooking order ${orderId}`
				}
			]
		});

		const imageMessage = await (
			(await this.container.client.channels.fetch(process.env.IMAGE_CHANNEL)) as TextChannel
		).send({ files: [image] });

		await order.update({
			image: imageMessage.attachments.first()!.url,
			status: "cooked"
		});

		return interaction.editReply({
			embeds: [
				{
					color: "GREEN",
					title: "Order cooked",
					description: `Order ${orderId} has been cooked.`
				}
			]
		});
	}
}
