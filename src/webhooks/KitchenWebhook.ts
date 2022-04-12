import type { Order } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { BaseOrderWebhook } from "../lib/BaseOrderWebhook";
import type { WebhookManagerOptions } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManagerOptions>(({ container }) => ({
	name: "kitchen",
	channelId: container.env.string("KITCHEN_CHANNEL"),
	webhookName: "Pixel Pizza Kitchen"
}))
export class KitchenWebhook extends BaseOrderWebhook {
	public override sendOrder(order: Order) {
		return super.sendOrder(order, this.container.env.string("CHEF_PING_ROLE"));
	}

	public override editOrder(order: Order) {
		return super.editOrder(order, this.container.env.string("CHEF_PING_ROLE"));
	}
}
