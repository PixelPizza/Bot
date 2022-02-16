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
                await webhooks.get("orderlog").sendOrder(model);
                await webhooks.get("kitchen").sendOrder(model);
                await webhooks.get("order").sendOrder(model);
            },
            async afterUpdate(model: Order) {
                const webhooks = container.stores.get("webhooks");
                await webhooks.get("orderlog").editOrder(model);
                await webhooks.get("kitchen").editOrder(model);
                if (model.status !== "uncooked") {
                    await webhooks.get("delivery").sendOrder(model);
                }
                if (["delivered", "deleted"].includes(model.status)) {
                    await webhooks.get("order").deleteOrder(model);
                } else {
                    await webhooks.get("order").editOrder(model);
                }
            },
            async afterDestroy(model: Order) {
                const webhooks = container.stores.get("webhooks");
                await webhooks.get("orderlog").deleteOrder(model);
                await webhooks.get("kitchen").deleteOrder(model);
                await webhooks.get("delivery").deleteOrder(model);
                await webhooks.get("order").deleteOrder(model);
            }
        }
    },
    model: Order as ModelCtor<Order>
}))
export class OrderModel extends ModelManager<Order> {}