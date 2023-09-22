import type { PrismaClient } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaModelManager } from "../lib/pieces/PrismaModelManager";

@ApplyOptions<PrismaModelManager.Options<PrismaClient["user"]>>(({ container }) => ({
	prisma: container.prisma.user
}))
export class UserModel extends PrismaModelManager<PrismaClient["user"]> {
	public findOrCreate(id: string) {
		return this.prisma.upsert({
			where: { id },
			update: {},
			create: { id }
		});
	}
}
