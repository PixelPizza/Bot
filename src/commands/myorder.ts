import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";
import type { CommandInteraction } from "discord.js";
import { OrderStatus } from "@prisma/client";

@ApplyOptions<Command.Options>({
	description: "Show your order",
	preconditions: ["HasOrder"]
})
export class MyOrderCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void  {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const order = await this.orderModel.findFirst({
			where: {
				customer: interaction.user.id,
				status: {
					in: [OrderStatus.UNCOOKED, OrderStatus.COOKED]
				}
			}
		});

		await interaction.editReply({ embeds: [await this.createOrderEmbed(order!)] });
	}
}
