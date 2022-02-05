import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, type PreconditionOptions } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
    name: "ValidOrderData"
})
export class ValidOrderDataPrecondition extends Precondition {
    public override async chatInputRun(interaction: CommandInteraction) {
        const orderModel = this.container.stores.get("models").get("order");
        const order = await orderModel.findOne({
            where: {
                id: interaction.options.getString("order", true)
            }
        });
        if (!order) return this.error({ message: "Order not found" });
        try {
            await order.fetchCustomer(true);
            await order.fetchGuild(true);
            await order.fetchChannel(true);
            return await this.ok();
        } catch {
            return this.error({ message: "Customer, guild or channel not found" })
        }
    }
}