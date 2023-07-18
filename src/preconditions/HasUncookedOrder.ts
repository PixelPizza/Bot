import { OrderStatus } from "@prisma/client";
import { Precondition } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";

export class HasOrderPrecondition extends Precondition {
	public override async chatInputRun(interaciton: ChatInputCommandInteraction) {
		const order = await this.container.stores
			.get("models")
			.get("order")
			.findFirst({
				where: {
					customer: interaciton.user.id,
					status: {
						in: [OrderStatus.UNCOOKED, OrderStatus.COOKED]
					}
				}
			});
		if (!order) return this.error({ message: "You don't have an order, use `/order` to order something" });
		if (order.status === OrderStatus.COOKED) return this.error({ message: "Your order has already been cooked" });
		return this.ok();
	}
}
