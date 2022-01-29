import { ApplyOptions } from "@sapphire/decorators";
import { BuildOptions, DataTypes, ModelCtor } from "sequelize";
import { ModelManager, ModelManagerOptions, Model } from "../pieces/ModelManager";

export interface UserTypes {
	id: string;
    deliveryMessage: string | null;
}

export interface UserCreateTypes {
	id: string;
}

export class User extends Model<UserTypes, UserCreateTypes> {
    public constructor(values?: UserCreateTypes, options?: BuildOptions) {
        super(values, options);
    }
    
    public override getData() {
        return {
            id: this.getDataValue("id"),
            deliveryMessage: this.getDataValue("deliveryMessage")
        };
    }
}

@ApplyOptions<ModelManagerOptions<User>>({
    attributes: {
        id: {
            type: DataTypes.STRING(18),
            primaryKey: true
        },
        deliveryMessage: DataTypes.STRING(1000)
    },
    model: User as ModelCtor<User>
})
export class UserModel extends ModelManager<UserTypes, UserCreateTypes, User> {}