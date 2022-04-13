import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
	name: "ExistingOrder"
})
export class ExistingOrderPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		const orderModel = this.container.prisma.order;
		const order = await orderModel.findUnique({ where: { id: interaction.options.getString("order", true) } });
		if (!order) return this.error({ message: "Order not found" });
		return this.ok();
	}
}
