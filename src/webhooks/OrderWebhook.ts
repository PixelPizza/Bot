import { ApplyOptions } from "@sapphire/decorators";
import type { MessageResolvable } from "discord.js";
import type { Order } from "../lib/models/Order";
import { WebhookManager, WebhookManagerOptions } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManagerOptions>({
    name: "order",
    webhookName: `Pixel Pizza Orders`,
    channelId: process.env.ORDER_LOG_CHANNEL
})
export class OrderWebhook extends WebhookManager {
    private readonly messages: {
        [key: string]: MessageResolvable;
    } = {};

    public async sendOrder(order: Order) {
        const id = order.getDataValue("id");
        if (id in this.messages) return;
        this.messages[id] = (await this.send({
            embeds: [await order.createOrderEmbed()]
        })).id;
    }

    public async editOrder(order: Order) {
        const id = order.getDataValue("id");
        if (!(id in this.messages)) return;
        await this.editMessage(this.messages[id], {
            embeds: [await order.createOrderEmbed()]
        });
    }
}