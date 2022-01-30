import { GuildTextBasedChannel, MessageEmbed } from "discord.js";
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
	private formatDate(date: Date) {
		return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} (dd-mm-YYYY)`;
	}

    public async createOrderEmbed() {
        const {order, customer, guild, channel, orderedAt, cookedAt, deliveredAt, id, status, deliveryMethod, chef, deliverer, image} = await this.getData();

        if (!customer) throw new Error("Customer not found");
        if (!guild) throw new Error("Guild not found");
        if (!channel) throw new Error("Channel not found");

        const embed = new MessageEmbed({
            color: "BLUE",
            title: "Order",
            description: order,
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
                    value: this.formatDate(orderedAt)
                }
            ],
            footer: {
                text: `ID: ${id} | status: ${status}${deliveryMethod ? ` | method: ${deliveryMethod}` : ""}${chef ? ` | chef: ${chef.tag} (${chef.id})` : ""}${deliverer ? ` | deliverer: ${deliverer.tag} (${deliverer.id})` : ""}`
            }
        });

        if (cookedAt) embed.addField("Cooked At", this.formatDate(cookedAt));
        if (deliveredAt) embed.addField("Delivered At", this.formatDate(deliveredAt));
        if (image) embed.setImage(image);

        embed.addField("\u200b", "\u200b");

        return embed;
    }
    
    public override async getData() {
        const {client} = this.container;
		const {users} = client;
		const guild = await client.guilds.fetch(this.getDataValue("guild")!).catch(() => null);
		return {
			id: this.getDataValue("id"),
			customer: await users.fetch(this.getDataValue("customer")).catch(() => null),
			guild,
			channel: (await guild?.channels.fetch(this.getDataValue("channel")) ?? guild?.systemChannel ?? null) as GuildTextBasedChannel | null,
			chef: await users.fetch(this.getDataValue("chef")!).catch(() => null),
			deliverer: await users.fetch(this.getDataValue("deliverer")!).catch(() => null),
			image: this.getDataValue("image"),
			status: this.getDataValue("status"),
			order: this.getDataValue("order"),
			orderedAt: this.getDataValue("orderedAt"),
			cookedAt: this.getDataValue("cookedAt"),
			deliveredAt: this.getDataValue("deliveredAt"),
			deliveryMethod: this.getDataValue("deliveryMethod"),
			deleteReason: this.getDataValue("deleteReason")
		};
    }
}