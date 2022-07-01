import { ApplyOptions } from "@sapphire/decorators";
import { BaseOrderWebhook } from "../lib/BaseOrderWebhook";

@ApplyOptions<BaseOrderWebhook.Options>(({ container }) => ({
	webhookName: `Pixel Pizza Orders`,
	channelId: container.env.string("ORDER_LOG_CHANNEL")
}))
export class OrderLogWebhook extends BaseOrderWebhook {}
