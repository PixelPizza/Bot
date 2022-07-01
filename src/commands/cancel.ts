import { OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Cancel your order",
	preconditions: ["HasOrder"]
})
export class CancelCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
		registry.registerChatInputCommand(this.defaultChatInputCommand, {
			idHints: ["992383505155756112", "946548123050856518"]
		});
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		await this.orderModel.delete({
			where: {
				id: (await this.orderModel.findFirst({
					where: {
						customer: interaction.user.id,
						status: {
							in: [OrderStatus.UNCOOKED, OrderStatus.COOKED]
						}
					}
				}))!.id
			}
		});

		await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("GREEN")
					.setTitle("Order cancelled")
					.setDescription("Your order has been cancelled.")
			]
		});
	}
}
