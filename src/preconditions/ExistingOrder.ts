import { Precondition } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

export class ExistingOrderPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		const orderModel = this.container.stores.get("models").get("order");
		const order = await orderModel.findUnique({ where: { id: interaction.options.getString("order", true) } });
		if (!order) return this.error({ message: "Order not found" });
		return this.ok();
	}
}
