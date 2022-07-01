import { Store } from "@sapphire/framework";
import type { BlacklistModel } from "../../models/blacklist";
import type { MessageModel } from "../../models/message";
import type { OrderModel } from "../../models/order";
import type { UserModel } from "../../models/user";
import { PrismaModelManager } from "../pieces/PrismaModelManager";

export class PrismaModelManagerStore extends Store<PrismaModelManager<any>> {
	public constructor() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		super(PrismaModelManager as any, { name: "models" });
	}

	public override get<K extends keyof PrismaModelManagerStoreEntries>(key: K): PrismaModelManagerStoreEntries[K];
	public override get(key: string) {
		return super.get(key);
	}
}

export interface PrismaModelManagerStoreEntries {
	order: OrderModel;
	user: UserModel;
	blacklist: BlacklistModel;
	message: MessageModel;
}
