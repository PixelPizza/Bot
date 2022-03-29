import { ApplyOptions } from "@sapphire/decorators";
import type { MessageResolvable } from "discord.js";
import type { Order } from "../lib/models/Order";
import { WebhookManager, WebhookManagerOptions } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManagerOptions>(({ container }) => ({
    name: "order",
    webhookName: `Pixel Pizza Orders`,
    channelId: container.env.string("ORDERS_CHANNEL")
}))
export class OrderWebhook extends WebhookManager {
    private readonly messages: {
        [key: string]: MessageResolvable;
    } = {};

    private initDone = false;

    private async initMessages() {
        if (this.initDone) return;
        this.initDone = true;
        (await this.container.stores.get("models").get("message").findAll({
            where: {
                channel: this.options.channelId
            }
        })).forEach(message => this.messages[message.order] = message.id);
    }

    private async addMessage(orderId: string, message: MessageResolvable) {
        await this.container.stores.get("models").get("message").create({
            id: typeof message === "string" ? message : message.id,
            channel: this.options.channelId,
            order: orderId
        });
        this.messages[orderId] = message;
    }

    private async removeMessage(orderId: string) {
        const message = this.messages[orderId];
        await this.container.stores.get("models").get("message").destroy({
            where: {
                id: typeof message === "string" ? message : message.id
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.messages[orderId];
    }

    public async sendOrder(order: Order) {
        await this.initMessages();
        const {id} = order;
        if (id in this.messages) return;
        await this.addMessage(id, (await this.send({
            embeds: [await order.createOrderEmbed()]
        })).id);
    }

    public async editOrder(order: Order) {
        await this.initMessages();
        const {id} = order;
        if (!(id in this.messages)) return;
        await this.editMessage(this.messages[id], {
            embeds: [await order.createOrderEmbed()]
        });
    }

    public async deleteOrder(order: Order) {
        await this.initMessages();
        const {id} = order;
        if (!(id in this.messages)) return;
        await this.deleteMessage(this.messages[id]);
        await this.removeMessage(id);
    }
}