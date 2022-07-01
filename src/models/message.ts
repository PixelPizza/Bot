import type { PrismaClient } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaModelManager } from "../lib/pieces/PrismaModelManager";

@ApplyOptions<PrismaModelManager.Options<PrismaClient["message"]>>(({ container }) => ({
	prisma: container.prisma.message
}))
export class MessageModel extends PrismaModelManager<PrismaClient["message"]> {}
