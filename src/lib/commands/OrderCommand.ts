import type { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import type { FindOptions, WhereOptions } from "sequelize";
import { Command } from "./Command";
import type { Order } from "../models/Order";
import { isUri } from "valid-url";
import { stripIndents } from "common-tags";

export abstract class OrderCommand extends Command {
    protected get orderModel() {
        return this.container.stores.get("models").get("order");
    }

    protected makeUserRegex(name: string) {
        return `${name}(?:: *(tag|id|username|name|ping|mention))?`;
    }

    protected get customerRegex() {
        return this.makeUserRegex("customer");
    }

    protected get chefRegex() {
        return this.makeUserRegex("chef");
    }

    protected makeDateRegex(name: string) {
        return `${name}date(?:: *(date|time|datetime))?`;
    }

    protected isImage(url: string) {
        return Boolean(isUri(url) && /\.(gif|jpe?g|tiff?|png|webp|bmp)(\?[^#]*)?(#.*)?$/i.test(url));
    }

    protected defaultDeliveryMessage = stripIndents`
        Hello {customer:tag},

        Here is your order

        id: {orderID}
        order: {order}
        server: {guild}
        channel: {channel}

        Ordered at: {orderdate:date}
        Cooked at: {cookdate:date}
        Delivered at: {deliverydate:date}

        It has been cooked by {chef:tag}
        It has been delivered by {deliverer:tag}

        I hope the order is what you wanted. If you have any complaints, please join our server and tell us.
        If you want to join our server this is the invite {invite}

        I hope you have a great day! bye!
        {image}
    `;

    protected async getOrder(interaction: ChatInputCommandInteraction, where?: WhereOptions<Order["_attributes"]>) {
        const order = await this.orderModel.findOne({
            where: {
                ...where,
                id: interaction.options.getString("order", true)
            }
        });
        if (!order) throw new Error("Order not found");
        return order;
    }

    protected async autocompleteOrder(interaction: AutocompleteInteraction, optionsGenerator: (focused: string) => FindOptions<Order["_attributes"]>, modifier?: (orders: Order[]) => Order[]) {
        const found = await this.orderModel.findAll(optionsGenerator(interaction.options.getFocused() as string));
        return interaction.respond(
            (modifier ? modifier(found) : found).map((order) => ({
                name: `${order.id} - ${order.order}`,
                value: order.id
            }))
        );
    }
}

export namespace OrderCommand {
    export enum ClaimType {
        Cooking = "cooking",
        Delivery = "delivery"
    }

    export enum DeliveryMethod {
        DM = "dm",
        Bot = "bot",
        Personal = "personal"
    }

    export interface Options extends Command.Options {}
}