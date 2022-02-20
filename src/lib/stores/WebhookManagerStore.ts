import { Store } from "@sapphire/framework";
import { WebhookManager } from "../pieces/WebhookManager";
import type { OrderLogWebhook } from "../../webhooks/OrderLogWebhook";
import type { KitchenWebhook } from "../../webhooks/KitchenWebhook";
import type { DeliveryWebhook } from "../../webhooks/DeliveryWebhook";
import type { ImageWebhook } from "../../webhooks/ImageWebhook";
import type { OrderWebhook } from "../../webhooks/OrderWebhook";

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
}