import type { Order } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { BaseOrderWebhook } from "../lib/BaseOrderWebhook";
import type { WebhookManagerOptions } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManagerOptions>(({ container }) => ({
    name: "delivery",
    channelId: container.env.string("DELIVERY_CHANNEL"),
    webhookName: "Pixel Pizza Delivery"
}))
export class DeliveryWebhook extends BaseOrderWebhook {
    public override sendOrder(order: Order) {
        return super.sendOrder(order, this.container.env.string("DELIVERER_PING_ROLE"));
    }

    public override editOrder(order: Order) {
        return super.editOrder(order, this.container.env.string("DELIVERER_PING_ROLE"));
    }
}