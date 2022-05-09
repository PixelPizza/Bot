import type { PrismaClient } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaModelManager, PrismaModelManagerOptions } from "../lib/pieces/PrismaModelManager";

@ApplyOptions<PrismaModelManagerOptions<any>>(({ container }) => ({
	name: "user",
	prisma: container.prisma.user
}))
export class UserModel extends PrismaModelManager<PrismaClient["user"]> {
	public findOrCreate(id: string) {
		return this.prisma
			.findUnique({ where: { id }, rejectOnNotFound: true })
			.catch(() => this.prisma.create({ data: { id } }));
	}
}
