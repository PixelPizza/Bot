import { ApplyOptions } from "@sapphire/decorators";
import { DataTypes } from "sequelize";
import { User } from "../lib/models/User";
import { ModelManager, ModelManagerOptions } from "../lib/pieces/ModelManager";

@ApplyOptions<ModelManagerOptions<User>>({
    name: "user",
    attributes: {
        id: {
            type: DataTypes.STRING(18),
            primaryKey: true
        },
        deliveryMessage: DataTypes.STRING(1000),
        balance: {
            type: DataTypes.INTEGER(),
            defaultValue: 0
        }
    },
    model: User
})
export class UserModel extends ModelManager<User> {}