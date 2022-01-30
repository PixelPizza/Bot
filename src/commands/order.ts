import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import { type CommandInteraction, MessageEmbed } from "discord.js";
import { randomInt } from "node:crypto";
import { Command } from "../lib/Command";

@ApplyOptions<CommandOptions>({
	description: "Order some food",
	requiredClientPermissions: ["CREATE_INSTANT_INVITE"],
	preconditions: ["GuildOnly"]
})
export class OrderCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("order").setDescription("The order you want to place").setRequired(true)
			)
		);
	}

	private async generateOrderID() {
		const orders = this.container.stores.get("models").get("order");
		let id: string;
		do {
			id = `00${randomInt(0, 999)}`.slice(-3);
		} while (await orders.findByPk(id));
		return id;
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const order = interaction.options.getString("order", true);
		const id = await this.generateOrderID();
		const orders = this.container.stores.get("models").get("order");

		await orders.create({
			id,
			order,
			customer: interaction.user.id,
			guild: interaction.guildId!,
			channel: interaction.channelId
		});

		await interaction.editReply({
			embeds: [
				new MessageEmbed({
					color: "GREEN",
					title: "Order Placed",
					description: `Your order has been placed`,
					fields: [
						{
							name: "Your order",
							value: order
						}
					],
					footer: {
						text: `ID: ${id}`
					}
				})
			]
		});
	}
}
