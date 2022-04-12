import { ApplyOptions } from "@sapphire/decorators";
import { BaseOrderWebhook } from "../lib/BaseOrderWebhook";
import type { WebhookManagerOptions } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManagerOptions>(({ container }) => ({
    name: "order",
    webhookName: `Pixel Pizza Orders`,
    channelId: container.env.string("ORDERS_CHANNEL")
}))
export class OrderWebhook extends BaseOrderWebhook {}