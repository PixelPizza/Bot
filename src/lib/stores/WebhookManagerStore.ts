import { Store } from "@sapphire/framework";
import type { DeliveryWebhook } from "../../webhooks/delivery";
import type { GuildWebhook } from "../../webhooks/guild";
import type { ImageWebhook } from "../../webhooks/image";
import type { KitchenWebhook } from "../../webhooks/kitchen";
import type { OrderLogWebhook } from "../../webhooks/orderlog";
import type { OrderWebhook } from "../../webhooks/order";
import { WebhookManager } from "../pieces/WebhookManager";

export class WebhookManagerStore extends Store<WebhookManager> {
	public constructor() {
		super(WebhookManager, { name: "webhooks" });
	}

	public override get<K extends keyof WebhookManagerStoreEntries>(key: K): WebhookManagerStoreEntries[K];
	public override get(key: string) {
		return super.get(key);
	}
}

export interface WebhookManagerStoreEntries {
	orderlog: OrderLogWebhook;
	order: OrderWebhook;
	kitchen: KitchenWebhook;
	delivery: DeliveryWebhook;
	image: ImageWebhook;
	guild: GuildWebhook;
}
