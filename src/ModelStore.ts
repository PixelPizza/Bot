import { Store } from "@sapphire/framework";
import { ModelPiece } from "./pieces/Model";
import type { OrderModel } from "./models/OrderModel";
import type { UserModel } from "./models/UserModel";

export class ModelStore extends Store<ModelPiece> {
	public constructor() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		super(ModelPiece as any, { name: "models" });
	}

	public override get<K extends keyof ModelStoreEntries>(key: K): ModelStoreEntries[K];
	public override get(key: string) {
		return super.get(key);
	}
}

export interface ModelStoreEntries {
	order: OrderModel;
	user: UserModel;
}
