import type { PrismaClient } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaModelManager, PrismaModelManagerOptions } from "../lib/pieces/PrismaModelManager";

@ApplyOptions<PrismaModelManagerOptions<PrismaClient["blacklist"]>>(({ container }) => ({
	name: "blacklist",
	prisma: container.prisma.blacklist
}))
export class BlacklistModel extends PrismaModelManager<PrismaClient["blacklist"]> {}
