import { Guild, Colors, MessageOptions, MessagePayload, NewsChannel, TextChannel, User, EmbedBuilder } from "discord.js";
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

    public fetchCustomer(required: true): Promise<User>;
    public fetchCustomer(required?: false): Promise<User | null>;
    public async fetchCustomer(required = false) {
        try {
            return await this.client.users.fetch(this.customer);
        } catch {
            if (required) throw new Error("Customer not found");
            return null;
        }
    }

    public get guild() {
        return this.getDataValue("guild");
    }

    public fetchGuild(required: true): Promise<Guild>;
    public fetchGuild(required?: false): Promise<Guild | null>;
    public async fetchGuild(required = false) {
        try {
            return await this.client.guilds.fetch(this.guild);
        } catch {
            if (required) throw new Error("Guild not found");
            return null;
        }
    }

    public get channel() {
        return this.getDataValue("channel");
    }

    public fetchChannel(required: true): Promise<NewsChannel | TextChannel>;
    public fetchChannel(required?: false): Promise<NewsChannel | TextChannel | null>;
    public async fetchChannel(required = false) {
        const guild = await this.fetchGuild();
        const channel = (await guild?.channels.fetch(this.channel)) ?? guild?.systemChannel ?? null;
        if (channel && !channel.isTextBased()) throw new Error("Invalid channel");
        if (!channel && required) throw new Error("Channel not found");
        return channel;
    }

    public get chef() {
        return this.getDataValue("chef");
    }

    public fetchChef(required: true): Promise<User>;
    public fetchChef(required?: false): Promise<User | null>;
    public async fetchChef(required = false) {
        try {
            return await this.client.users.fetch(this.chef!);
        } catch {
            if (required) throw new Error("Chef not found");
            return null;
        }
    }

    public get deliverer() {
        return this.getDataValue("deliverer");
    }

    public fetchDeliverer(required: true): Promise<User>;
    public fetchDeliverer(required?: false): Promise<User | null>;
    public async fetchDeliverer(required = false) {
        try {
            return await this.client.users.fetch(this.deliverer!);
        } catch {
            if (required) throw new Error("Deliverer not found");
            return null;
        }
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
        const { deliveryMethod } = this;
        const customer = await this.fetchCustomer(true);
        const guild = await this.fetchGuild(true);
        const channel = await this.fetchChannel(true);
        const chef = await this.fetchChef();
        const deliverer = await this.fetchDeliverer();

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle("Order")
            .setDescription(this.order)
            .addFields(
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
            )
            .setFooter({ text: `ID: ${this.id} | status: ${this.status}${deliveryMethod ? ` | method: ${deliveryMethod}` : ""}${chef ? ` | chef: ${chef.tag} (${chef.id})` : ""}${deliverer ? ` | deliverer: ${deliverer.tag} (${deliverer.id})` : ""}` });

        if (this.cookedAt) embed.addFields({ name: "Cooked At", value: this.formatDate(this.cookedAt) });
        if (this.deliveredAt) embed.addFields({ name: "Delivered At", value: this.formatDate(this.deliveredAt) });
        if (this.image) embed.setImage(this.image);

        embed.addFields({ name: "\u200b", value: "\u200b" });

        return embed;
    }

    public sendCustomerMessage(options: string | MessagePayload | MessageOptions) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return this.fetchCustomer(true).then(customer => customer.send(options)).catch(() => {});
    }
}