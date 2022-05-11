import type { PrismaClient } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { PrismaModelManager, PrismaModelManagerOptions } from "../lib/pieces/PrismaModelManager";

@ApplyOptions<PrismaModelManagerOptions<PrismaClient["message"]>>(({ container }) => ({
	name: "message",
	prisma: container.prisma.message
}))
export class MessageModel extends PrismaModelManager<PrismaClient["message"]> {}
