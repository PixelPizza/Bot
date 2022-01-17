import type { PieceContext } from "@sapphire/framework";
import type { GuildTextBasedChannel } from "discord.js";
import { DataTypes, Model } from "sequelize";
import { ModelPiece } from "../pieces/Model";

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
}

export interface OrderCreateTypes {
	id: string;
	customer: string;
	guild: string;
	channel: string;
	order: string;
}

export class OrderModel extends ModelPiece<{
	attributes: {
		id: {
			type: DataTypes.StringDataType;
			primaryKey: true;
		};
		customer: {
			type: DataTypes.StringDataType;
			allowNull: false;
		};
		guild: {
			type: DataTypes.StringDataType;
			allowNull: false;
		};
		channel: {
			type: DataTypes.StringDataType;
			allowNull: false;
		};
		chef: {
			type: DataTypes.StringDataType;
			defaultValue: null;
		};
		deliverer: {
			type: DataTypes.StringDataType;
			defaultValue: null;
		};
		image: {
			type: DataTypes.StringDataType;
			defaultValue: null;
		};
		status: {
			type: DataTypes.EnumDataType<"uncooked" | "cooked" | "delivered" | "deleted">;
			allowNull: false;
			defaultValue: "uncooked";
		};
		order: {
			type: DataTypes.StringDataType;
			allowNull: false;
		};
		orderedAt: {
			type: DataTypes.DateDataType;
			allowNull: false;
			defaultValue: typeof DataTypes.NOW;
		};
		cookedAt: {
			type: DataTypes.DateDataType;
			defaultValue: null;
		};
		deliveredAt: {
			type: DataTypes.DateDataType;
			defaultValue: null;
		};
		deliveryMethod: {
			type: DataTypes.EnumDataType<"dm" | "bot" | "personal">;
			defaultValue: null;
		};
	};
	types: OrderTypes;
	createTypes: OrderCreateTypes;
}> {
	public constructor(context: PieceContext) {
		super(context, {
			name: "order",
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
				}
			}
		});
	}

	public async getData(model: Model<OrderTypes, OrderCreateTypes>) {
		const {client} = this.container;
		const {users} = client;
		const guild = await client.guilds.fetch(model.getDataValue("guild")!).catch(() => null);
		return {
			id: model.getDataValue("id"),
			customer: await users.fetch(model.getDataValue("customer")).catch(() => null),
			guild,
			channel: (await guild?.channels.fetch(model.getDataValue("channel")) ?? guild?.systemChannel ?? null) as GuildTextBasedChannel | null,
			chef: await users.fetch(model.getDataValue("chef")!).catch(() => null),
			deliverer: await users.fetch(model.getDataValue("deliverer")!).catch(() => null),
			image: model.getDataValue("image"),
			status: model.getDataValue("status"),
			order: model.getDataValue("order"),
			orderedAt: model.getDataValue("orderedAt"),
			cookedAt: model.getDataValue("cookedAt"),
			deliveredAt: model.getDataValue("deliveredAt"),
			deliveryMethod: model.getDataValue("deliveryMethod")
		};
	}
}
