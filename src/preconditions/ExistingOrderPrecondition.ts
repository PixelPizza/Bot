import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
    name: "ExistingOrder"
})
export class ExistingOrderPrecondition extends Precondition {
    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        const orderModel = this.container.stores.get("models").get("order");
        const order = await orderModel.findByPk(interaction.options.getString("order", true));
        if (!order) return this.error({ message: "Order not found" });
        return this.ok();
    }
}