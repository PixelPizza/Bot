import { Store } from "@sapphire/framework";
import type { DeliveryWebhook } from "../../webhooks/DeliveryWebhook";
import type { GuildWebhook } from "../../webhooks/GuildWebhook";
import type { ImageWebhook } from "../../webhooks/ImageWebhook";
import type { KitchenWebhook } from "../../webhooks/KitchenWebhook";
import type { OrderLogWebhook } from "../../webhooks/OrderLogWebhook";
import type { OrderWebhook } from "../../webhooks/OrderWebhook";
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
