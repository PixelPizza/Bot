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

    private initDone = false;

    private async initMessages() {
        if (this.initDone) return;
        this.initDone = true;
        (await this.container.stores.get("models").get("message").findAll({
            where: {
                channelId: this.options.channelId
            }
        })).forEach(message => this.messages[message.orderId] = message.id);
    }

    private async addMessage(orderId: string, message: MessageResolvable) {
        await this.container.stores.get("models").get("message").create({
            id: typeof message === "string" ? message : message.id,
            channelId: this.options.channelId,
            orderId
        });
        this.messages[orderId] = message;
    }

    public async sendOrder(order: Order) {
        await this.initMessages();
        const {id} = order;
        if (id in this.messages) return this.editOrder(order);
        await this.addMessage(id, (await this.send({
            content: `<@&${process.env.DELIVERER_PING_ROLE}>`,
            embeds: [await order.createOrderEmbed()]
        })).id);
    }

    public async editOrder(order: Order) {
        await this.initMessages();
        const {id} = order;
        if (!(id in this.messages)) return;
        await this.editMessage(this.messages[id], {
            content: `<@&${process.env.DELIVERER_PING_ROLE}>`,
            embeds: [await order.createOrderEmbed()]
        });
    }
}