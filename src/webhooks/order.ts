import { ApplyOptions } from "@sapphire/decorators";
import { BaseOrderWebhook } from "../lib/BaseOrderWebhook";

@ApplyOptions<BaseOrderWebhook.Options>(({ container }) => ({
	webhookName: `Pixel Pizza Orders`,
	channelId: container.env.string("ORDERS_CHANNEL")
}))
export class OrderWebhook extends BaseOrderWebhook {}
