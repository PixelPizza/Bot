import { ApplyOptions } from "@sapphire/decorators";
import { BaseOrderWebhook } from "../lib/BaseOrderWebhook";
import type { WebhookManagerOptions } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManagerOptions>(({ container }) => ({
	name: "orderlog",
	webhookName: `Pixel Pizza Orders`,
	channelId: container.env.string("ORDER_LOG_CHANNEL")
}))
export class OrderLogWebhook extends BaseOrderWebhook {}
