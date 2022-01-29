import { Store } from "@sapphire/framework";
import type { OrderModel } from "../models/OrderModel";
import type { UserModel } from "../models/UserModel";
import { ModelManager } from "../pieces/ModelManager";

export class ModelManagerStore extends Store<ModelManager<any, any, any>> {
    public constructor() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        super(ModelManager as any, { name: "models" });
    }

    public override get<K extends keyof ModelManagerStoreEntries>(key: K): ModelManagerStoreEntries[K];
	public override get(key: string) {
		return super.get(key);
	}
}

export interface ModelManagerStoreEntries {
	order: OrderModel;
	user: UserModel;
}