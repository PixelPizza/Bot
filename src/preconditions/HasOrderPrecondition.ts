import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
    name: "HasOrder"
})
export class HasOrderPrecondition extends Precondition {
    public override async chatInputRun(interaciton: ChatInputCommandInteraction) {
        const orders = await this.container.stores.get("models").get("order").count({
            where: {
                customer: interaciton.user.id,
                status: ["uncooked", "cooked"]
            }
        });
        if (orders === 0) return this.error({ message: "You don't have an order, use `/order` to order something" });
        return this.ok();
    }
}