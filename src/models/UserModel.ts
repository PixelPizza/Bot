import type { PieceContext } from "@sapphire/framework";
import { DataTypes, type Model } from "sequelize";
import { ModelPiece } from "../pieces/Model";

export interface UserTypes {
    id: string;
    deliveryMessage: string | null;
}

export interface UserCreateTypes {
    id: string;
}

export class UserModel extends ModelPiece<{
    id: {
        type: DataTypes.StringDataType;
        primaryKey: true;
    };
    deliveryMessage: DataTypes.StringDataType;
}, UserTypes, UserCreateTypes> {
    public constructor(context: PieceContext) {
        super(context, {
            name: "user",
            attributes: {
                id: {
                    type: DataTypes.STRING(18),
                    primaryKey: true
                },
                deliveryMessage: DataTypes.STRING(1000)
            }
        });
    }

    public getData(model: Model<UserTypes, UserCreateTypes>): Promise<{ id: unknown; deliveryMessage: unknown; }> {
        return Promise.resolve({
            id: model.getDataValue("id"),
            deliveryMessage: model.getDataValue("deliveryMessage")
        });
    }
}