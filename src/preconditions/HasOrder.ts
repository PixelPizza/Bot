import { OrderStatus } from "@prisma/client";
import { Precondition } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";

export class HasOrderPrecondition extends Precondition {
	public override async chatInputRun(interaciton: ChatInputCommandInteraction) {
		const orders = await this.container.stores
			.get("models")
			.get("order")
			.count({
				where: {
					customer: interaciton.user.id,
					status: {
						in: [OrderStatus.UNCOOKED, OrderStatus.COOKED]
					}
				}
			});
		if (orders === 0) return this.error({ message: "You don't have an order, use `/order` to order something" });
		return this.ok();
	}
}
