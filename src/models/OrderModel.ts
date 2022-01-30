import { ApplyOptions } from "@sapphire/decorators";
import { DataTypes, ModelCtor } from "sequelize";
import { Order } from "../lib/models/Order";
import { ModelManager, ModelManagerOptions } from "../lib/pieces/ModelManager";

@ApplyOptions<ModelManagerOptions<Order>>(({ container }) => ({
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
        },
        deleteReason: {
            type: DataTypes.STRING(),
            defaultValue: null
        }
    },
    initOptions: {
        hooks: {
            async afterCreate(model: Order) {
                const webhooks = container.stores.get("webhooks");
                await webhooks.get("order").sendOrder(model);
            },
            async afterUpdate(model: Order) {
                const webhooks = container.stores.get("webhooks");
                await webhooks.get("order").editOrder(model);
            }
        }
    },
    model: Order as ModelCtor<Order>
}))
export class OrderModel extends ModelManager<Order["_attributes"], Order["_creationAttributes"], Order> {}