import { MessageEmbed } from "discord.js";
import { Model } from "../pieces/ModelManager";

interface OrderTypes {
	id: string;
	customer: string;
	guild: string;
	channel: string;
	chef: string | null;
	deliverer: string | null;
	image: string | null;
	status: "uncooked" | "cooked" | "delivered" | "deleted";
	order: string;
	orderedAt: Date;
	cookedAt: Date | null;
	deliveredAt: Date | null;
	deliveryMethod: "dm" | "bot" | "personal" | null;
	deleteReason: string | null;
}

interface OrderCreateTypes {
	id: string;
	customer: string;
	guild: string;
	channel: string;
	order: string;
}

export class Order extends Model<OrderTypes, OrderCreateTypes> {
    private get client() {
        return this.container.client;
    }

    public get id() {
        return this.getDataValue("id");
    }

    public get customer() {
        return this.getDataValue("customer");
    }

    public fetchCustomer() {
        return this.client.users.fetch(this.customer).catch(() => null);
    }

    public get guild() {
        return this.getDataValue("guild");
    }

    public fetchGuild() {
        return this.client.guilds.fetch(this.guild).catch(() => null);
    }

    public get channel() {
        return this.getDataValue("channel");
    }

    public async fetchChannel() {
        const guild = await this.fetchGuild();
        const channel = (await guild?.channels.fetch(this.channel)) ?? guild?.systemChannel ?? null;
        if (channel && !channel.isText()) throw new Error("Invalid channel");
        return channel;
    }

    public get chef() {
        return this.getDataValue("chef");
    }

    public fetchChef() {
        return this.client.users.fetch(this.chef!).catch(() => null);
    }

    public get deliverer() {
        return this.getDataValue("deliverer");
    }

    public fetchDeliverer() {
        return this.client.users.fetch(this.deliverer!).catch(() => null);
    }

    public get image() {
        return this.getDataValue("image");
    }

    public get status() {
        return this.getDataValue("status");
    }

    public get order() {
        return this.getDataValue("order");
    }

    public get orderedAt() {
        return this.getDataValue("orderedAt");
    }

    public get cookedAt() {
        return this.getDataValue("cookedAt");
    }

    public get deliveredAt() {
        return this.getDataValue("deliveredAt");
    }

    public get deliveryMethod() {
        return this.getDataValue("deliveryMethod");
    }

    public get deleteReason() {
        return this.getDataValue("deleteReason");
    }

	private formatDate(date: Date) {
		return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} (dd-mm-YYYY)`;
	}

    public async createOrderEmbed() {
        const customer = await this.fetchCustomer();
        const guild = await this.fetchGuild();
        const channel = await this.fetchChannel();

        if (!customer) throw new Error("Customer not found");
        if (!guild) throw new Error("Guild not found");
        if (!channel) throw new Error("Channel not found");

        const { deliveryMethod } = this;
        const chef = await this.fetchChef();
        const deliverer = await this.fetchDeliverer();

        const embed = new MessageEmbed({
            color: "BLUE",
            title: "Order",
            description: this.order,
            fields: [
                {
                    name: "\u200b",
                    value: "\u200b"
                },
                {
                    name: "Customer",
                    value: `${customer.tag} (${customer.id})`
                },
                {
                    name: "Guild",
                    value: guild.name
                },
                {
                    name: "Channel",
                    value: channel.name
                },
                {
                    name: "\u200b",
                    value: "\u200b"
                },
                {
                    name: "Ordered At",
                    value: this.formatDate(this.orderedAt)
                }
            ],
            footer: {
                text: `ID: ${this.id} | status: ${this.status}${deliveryMethod ? ` | method: ${deliveryMethod}` : ""}${chef ? ` | chef: ${chef.tag} (${chef.id})` : ""}${deliverer ? ` | deliverer: ${deliverer.tag} (${deliverer.id})` : ""}`
            }
        });

        if (this.cookedAt) embed.addField("Cooked At", this.formatDate(this.cookedAt));
        if (this.deliveredAt) embed.addField("Delivered At", this.formatDate(this.deliveredAt));
        if (this.image) embed.setImage(this.image);

        embed.addField("\u200b", "\u200b");

        return embed;
    }
}