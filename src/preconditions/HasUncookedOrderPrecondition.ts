import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
    name: "HasUncookedOrder"
})
export class HasOrderPrecondition extends Precondition {
    public override async chatInputRun(interaciton: CommandInteraction) {
        const order = await this.container.stores.get("models").get("order").findOne({
            where: {
                customer: interaciton.user.id,
                status: ["uncooked", "cooked"]
            }
        });
        if (!order) return this.error({ message: "You don't have an order, use `/order` to order something" });
        if (order.status === "cooked") return this.error({ message: "Your order has already been cooked" });
        return this.ok();
    }
}