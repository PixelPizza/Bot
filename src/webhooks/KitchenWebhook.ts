import { ApplyOptions } from "@sapphire/decorators";
import { Embed, Colors, MessageResolvable } from "discord.js";
import type { Order } from "../lib/models/Order";
import { WebhookManager, WebhookManagerOptions } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManagerOptions>({
    name: "kitchen",
    channelId: process.env.KITCHEN_CHANNEL,
    webhookName: "Pixel Pizza Kitchen"
})
export class KitchenWebhook extends WebhookManager {
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
            content: `<@&${process.env.CHEF_PING_ROLE}>`,
            embeds: [await order.createOrderEmbed()]
        })).id);
    }

    public async editOrder(order: Order) {
        await this.initMessages();
        const {id} = order;
        if (!(id in this.messages)) return;
        await this.editMessage(this.messages[id], {
            content: `<@&${process.env.CHEF_PING_ROLE}>`,
            embeds: [await order.createOrderEmbed()]
        });
    }

    public async deleteOrder(order: Order) {
        await this.initMessages();
        const {id} = order;
        if (!(id in this.messages)) return;
        await this.editMessage(this.messages[id], {
            embeds: [
                new Embed()
                    .setColor(Colors.DarkRed)
                    .setTitle("Order deleted")
                    .setDescription(`This order has been deleted`)
            ]
        });
        await this.removeMessage(id);
    }
}