import { ApplyOptions } from "@sapphire/decorators";
import type { MessageResolvable } from "discord.js";
import type { Order } from "../lib/models/Order";
import { WebhookManager, WebhookManagerOptions } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManagerOptions>({
    name: "delivery",
    channelId: process.env.DELIVERY_CHANNEL,
    webhookName: "Pixel Pizza Delivery"
})
export class DeliveryWebhook extends WebhookManager {
    private readonly messages: {
        [key: string]: MessageResolvable;
    } = {};

    public async sendOrder(order: Order) {
        const id = order.getDataValue("id");
        if (id in this.messages) return this.editOrder(order);
        this.messages[id] = (await this.send({
            content: `<@&${process.env.DELIVERER_PING_ROLE}>`,
            embeds: [await order.createOrderEmbed()]
        })).id;
    }

    public async editOrder(order: Order) {
        const id = order.getDataValue("id");
        if (!(id in this.messages)) return;
        await this.editMessage(this.messages[id], {
            content: `<@&${process.env.DELIVERER_PING_ROLE}>`,
            embeds: [await order.createOrderEmbed()]
        });
    }
}