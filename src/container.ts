import { PrismaClient } from "@prisma/client";
import { container } from "@sapphire/framework";

declare module "@sapphire/pieces" {
	interface Container {
		prisma: PrismaClient;
		formatDate: (date: Date) => string;
	}
}

container.prisma = new PrismaClient();
container.formatDate = (date: Date) => `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} (dd-mm-YYYY)`;
