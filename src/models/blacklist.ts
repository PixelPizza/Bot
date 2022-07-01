import type { PrismaClient } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaModelManager } from "../lib/pieces/PrismaModelManager";

@ApplyOptions<PrismaModelManager.Options<PrismaClient["blacklist"]>>(({ container }) => ({
	prisma: container.prisma.blacklist
}))
export class BlacklistModel extends PrismaModelManager<PrismaClient["blacklist"]> {}
