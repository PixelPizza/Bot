import { OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
	description: "Edit your order",
	preconditions: ["HasUncookedOrder"],
	cooldownDelay: Time.Minute * 5
})
export class EditCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
		registry.registerChatInputCommand(
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("order").setDescription("The new order").setRequired(true)
			),
			{
				idHints: ["992383589217996900", "946548209512243230"]
			}
		);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const order = (await this.orderModel.findFirst({
			where: {
				customer: interaction.user.id,
				status: OrderStatus.UNCOOKED
			}
		}))!;

		await this.orderModel.update({
			data: {
				order: interaction.options.getString("order", true)
			},
			where: {
				id: order.id
			}
		});

		await interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("GREEN")
					.setTitle("Order edited")
					.setDescription("Your order has been edited.")
					.addField("Your order", order.order)
			]
		});
	}
}
