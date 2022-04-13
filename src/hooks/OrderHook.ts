import { Order, OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaHookManager } from "../lib/pieces/PrismaHookManager";

@ApplyOptions<PrismaHookManager.Options<"Order">>(({ container }) => ({
	name: "Order",
	prisma: container.prisma.order
}))
export class OrderHook extends PrismaHookManager<"Order"> {
	public override afterCreate = async (model: Order) => {
		const webhooks = this.container.stores.get("webhooks");
		await webhooks.get("orderlog").sendOrder(model);
		await webhooks.get("kitchen").sendOrder(model);
		await webhooks.get("order").sendOrder(model);
	};

	public override afterUpdate = async (model: Order) => {
		const webhooks = this.container.stores.get("webhooks");
		await webhooks.get("orderlog").editOrder(model);
		await webhooks.get("kitchen").editOrder(model);
		if (model.status === OrderStatus.COOKED || model.status === OrderStatus.DELIVERED) {
			await webhooks.get("delivery").sendOrder(model);
		} else {
			await webhooks.get("delivery").editOrder(model);
		}
		if (model.status === OrderStatus.DELIVERED || model.status === OrderStatus.DELETED) {
			await webhooks.get("order").deleteOrder(model);
		} else {
			await webhooks.get("order").editOrder(model);
		}
	};

	public override afterDelete = async (model: Order) => {
		const webhooks = this.container.stores.get("webhooks");
		await webhooks.get("orderlog").deleteOrder(model);
		await webhooks.get("kitchen").deleteOrder(model);
		await webhooks.get("delivery").deleteOrder(model);
		await webhooks.get("order").deleteOrder(model);
	};
}
