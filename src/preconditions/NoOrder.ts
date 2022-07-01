import { OrderStatus } from "@prisma/client";
import { Precondition } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

export class NoOrderPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		const orders = await this.container.stores
			.get("models")
			.get("order")
			.count({
				where: {
					customer: interaction.user.id,
					status: {
						in: [OrderStatus.UNCOOKED, OrderStatus.COOKED]
					}
				}
			});
		if (orders > 0) return this.error({ message: "You already have an order" });
		return this.ok();
	}
}
