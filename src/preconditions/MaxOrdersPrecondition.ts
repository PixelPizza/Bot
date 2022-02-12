import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";

@ApplyOptions<PreconditionOptions>({
    name: "MaxOrders"
})
export class MaxOrdersPrecondition extends Precondition {
    public override async chatInputRun() {
        const orders = await this.container.stores.get("models").get("order").count({
            where: {
                status: ["uncooked", "cooked"]
            }
        });
        if (orders > process.env.MAX_ORDERS) return this.error({ message: "The maximum number of orders has been reached" });
        return this.ok();
    }
}