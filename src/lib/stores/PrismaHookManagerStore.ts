import { Store } from "@sapphire/framework";
import { PrismaHookManager } from "../pieces/PrismaHookManager";

export class PrismaHookManagerStore extends Store<PrismaHookManager<any>> {
	public constructor() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		super(PrismaHookManager as any, { name: "hooks" });
	}
}
