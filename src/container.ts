import { PrismaClient } from "@prisma/client";
import { container } from "@sapphire/framework";

declare module "@sapphire/pieces" {
    interface Container {
        prisma: PrismaClient;
    }
}

container.prisma = new PrismaClient();