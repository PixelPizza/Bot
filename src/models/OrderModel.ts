import type { PieceContext } from "@sapphire/framework";
import { DataTypes } from "sequelize";
import { ModelPiece } from "../pieces/Model";

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
			type: DataTypes.EnumDataType<"unclaimed" | "claimed" | "cooking" | "cooked" | "delivered" | "deleted">;
			allowNull: false;
			defaultValue: "unclaimed";
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
	types: {
		id: string;
		customer: string;
		guild: string;
		channel: string;
		chef: string | null;
		deliverer: string | null;
		image: string | null;
		status: "unclaimed" | "claimed" | "cooking" | "cooked" | "delivered" | "deleted";
		order: string;
		orderedAt: Date;
		cookedAt: Date | null;
		deliveredAt: Date | null;
		deliveryMethod: "dm" | "bot" | "personal" | null;
	};
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
					type: DataTypes.ENUM("unclaimed", "claimed", "cooking", "cooked", "delivered", "deleted"),
					allowNull: false,
					defaultValue: "unclaimed"
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
}
