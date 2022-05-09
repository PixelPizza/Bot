import type { PrismaClient, Prisma } from "@prisma/client";
import { Piece, PieceContext, PieceOptions } from "@sapphire/framework";

export interface PrismaModelManagerOptions<Delegate> extends PieceOptions {
    prisma: Delegate;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export abstract class PrismaModelManager<Delegate extends PrismaClient[Lowercase<Prisma.ModelName>]> extends Piece<PrismaModelManagerOptions<Delegate>> {
    protected readonly prisma: Delegate;

    public constructor(context: PieceContext, options: PrismaModelManagerOptions<Delegate>) {
        super(context, options);
        this.prisma = options.prisma;
    }

    public get aggregate() {
        return this.prisma.aggregate.bind(this.prisma);
    }

    public get count() {
        return this.prisma.count.bind(this.prisma);
    }

    public get create() {
        return this.prisma.create.bind(this.prisma);
    }

    public get createMany() {
        return this.prisma.createMany.bind(this.prisma);
    }

    public get delete() {
        return this.prisma.delete.bind(this.prisma);
    }

    public get deleteMany() {
        return this.prisma.deleteMany.bind(this.prisma);
    }

    public get findFirst() {
        return this.prisma.findFirst.bind(this.prisma);
    }

    public get findMany() {
        return this.prisma.findMany.bind(this.prisma);
    }

    public get findUnique() {
        return this.prisma.findUnique.bind(this.prisma);
    }

    public get groupBy() {
        return this.prisma.groupBy.bind(this.prisma);
    }

    public get update() {
        return this.prisma.update.bind(this.prisma);
    }

    public get updateMany() {
        return this.prisma.updateMany.bind(this.prisma);
    }

    public get upsert() {
        return this.prisma.upsert.bind(this.prisma);
    }
}
