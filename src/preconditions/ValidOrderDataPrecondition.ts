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
        const customer = await order.fetchCustomer();
        const guild = await order.fetchGuild();
        const channel = await order.fetchChannel();
        if (!customer || !guild || !channel) return this.error({ message: "Customer, guild or channel not found" });
        return this.ok();
    }
}