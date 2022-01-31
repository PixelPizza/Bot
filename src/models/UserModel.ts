import { ApplyOptions } from "@sapphire/decorators";
import { DataTypes, ModelCtor } from "sequelize";
import { User } from "../lib/models/User";
import { ModelManager, ModelManagerOptions } from "../lib/pieces/ModelManager";

@ApplyOptions<ModelManagerOptions<User>>({
    name: "user",
    attributes: {
        id: {
            type: DataTypes.STRING(18),
            primaryKey: true
        },
        deliveryMessage: DataTypes.STRING(1000)
    },
    model: User as ModelCtor<User>
})
export class UserModel extends ModelManager<User> {}