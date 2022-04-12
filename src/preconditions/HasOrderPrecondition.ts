import { OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
	name: "HasOrder"
})
export class HasOrderPrecondition extends Precondition {
	public override async chatInputRun(interaciton: CommandInteraction) {
		const orders = await this.container.prisma.order.count({
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
