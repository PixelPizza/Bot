import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../Command";

@ApplyOptions<CommandOptions>({
	description: "Claim an order",
	preconditions: ["ChefOnly"]
})
export class ClaimCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("order").setDescription("The order to claim").setRequired(true)
			)
		);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
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

		if (order.getDataValue("status") === "claimed") {
			return interaction.editReply({
				embeds: [
					new MessageEmbed({
						color: "RED",
						title: "Order already claimed",
						description: "The order you specified has already been claimed"
					})
				]
			});
		}

		await order.update({
			status: "claimed",
			chef: interaction.user.id
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed({
					color: "BLUE",
					title: "Order claimed",
					description: `You claimed order \`${order.getDataValue("id")}\``
				})
			]
		});
	}
}
