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
        const messageOptions = {
            embeds: [await order.createOrderEmbed()]
        };
        if (!(id in this.messages)) {
            const message = await this.send(messageOptions);
            this.messages[id] = message.id;
            return;
        }
        await this.editMessage(this.messages[id], messageOptions);
    }
}