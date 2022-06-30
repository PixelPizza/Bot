import type { Order } from "@prisma/client";
import { MessageEmbed, MessageOptions, MessageResolvable } from "discord.js";
import { WebhookManager } from "./pieces/WebhookManager";

export abstract class BaseOrderWebhook extends WebhookManager {
	private readonly messages: {
		[key: string]: MessageResolvable;
	} = {};

	private initDone = false;

	public async sendOrder(order: Order, roleId?: string) {
		await this.initMessages();
		const { id } = order;
		if (id in this.messages) return this.editOrder(order, roleId);
		const options: MessageOptions = {
			embeds: [await this.createEmbed(order)]
		};
		if (roleId) options.content = `<@&${roleId}>`;
		await this.addMessage(id, (await this.send(options)).id);
	}

	public async editOrder(order: Order, roleId?: string) {
		await this.initMessages();
		const { id } = order;
		if (!(id in this.messages)) return;
		const options: MessageOptions = {
			embeds: [await this.createEmbed(order)]
		};
		if (roleId) options.content = `<@&${roleId}>`;
		await this.editMessage(this.messages[id], options);
	}

	public async deleteOrder(order: Order) {
		await this.initMessages();
		const { id } = order;
		if (!(id in this.messages)) return;
		await this.editMessage(this.messages[id], {
			embeds: [
				new MessageEmbed()
					.setColor("DARK_RED")
					.setTitle("Order deleted")
					.setDescription(`This order has been deleted`)
			]
		});
		await this.removeMessage(id);
	}

	private async initMessages() {
		if (this.initDone) return;
		this.initDone = true;
		(
			await this.container.stores
				.get("models")
				.get("message")
				.findMany({
					where: {
						channel: this.options.channelId
					}
				})
		).forEach((message) => (this.messages[message.order] = message.id));
	}

	private async addMessage(orderId: string, message: MessageResolvable) {
		await this.container.stores
			.get("models")
			.get("message")
			.create({
				data: {
					id: typeof message === "string" ? message : message.id,
					channel: this.options.channelId,
					order: orderId
				}
			});
		this.messages[orderId] = message;
	}

	private async removeMessage(orderId: string) {
		const message = this.messages[orderId];
		await this.container.stores
			.get("models")
			.get("message")
			.delete({
				where: {
					id: typeof message === "string" ? message : message.id
				}
			});
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete this.messages[orderId];
	}

	private get createEmbed() {
		const orderModel = this.container.stores.get("models").get("order");
		return orderModel.createEmbed.bind(orderModel);
	}
}

export namespace BaseOrderWebhook {
	export type Options = WebhookManager.Options;
}
