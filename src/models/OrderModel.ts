import { ApplyOptions } from "@sapphire/decorators";
import type { GuildTextBasedChannel } from "discord.js";
import { BuildOptions, DataTypes, ModelCtor } from "sequelize";
import { ModelManager, ModelManagerOptions, Model } from "../pieces/ModelManager";

export interface OrderTypes {
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

export interface OrderCreateTypes {
	id: string;
	customer: string;
	guild: string;
	channel: string;
	order: string;
}

export class Order extends Model<OrderTypes, OrderCreateTypes> {
    public constructor(values?: OrderCreateTypes, options?: BuildOptions) {
        super(values, options);
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

@ApplyOptions<ModelManagerOptions<Order>>({
    attributes: {
        id: {
            type: DataTypes.STRING(3),
            primaryKey: true
        },
        customer: {
            type: DataTypes.STRING(18),
            allowNull: false
        },
        guild: {
            type: DataTypes.STRING(18),
            allowNull: false
        },
        channel: {
            type: DataTypes.STRING(18),
            allowNull: false
        },
        chef: {
            type: DataTypes.STRING(18),
            defaultValue: null
        },
        deliverer: {
            type: DataTypes.STRING(18),
            defaultValue: null
        },
        image: {
            type: DataTypes.STRING(500),
            defaultValue: null
        },
        status: {
            type: DataTypes.ENUM("uncooked", "cooked", "delivered", "deleted"),
            allowNull: false,
            defaultValue: "uncooked"
        },
        order: {
            type: DataTypes.STRING(2048),
            allowNull: false
        },
        orderedAt: {
            type: DataTypes.DATE(),
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        cookedAt: {
            type: DataTypes.DATE(),
            defaultValue: null
        },
        deliveredAt: {
            type: DataTypes.DATE(),
            defaultValue: null
        },
        deliveryMethod: {
            type: DataTypes.ENUM("dm", "bot", "personal"),
            defaultValue: null
        },
        deleteReason: {
            type: DataTypes.STRING(),
            defaultValue: null
        }
    },
    model: Order as ModelCtor<Order>
})
export class OrderModel extends ModelManager<OrderTypes, OrderCreateTypes, Order> {}