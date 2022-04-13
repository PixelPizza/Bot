import type { Prisma, PrismaClient } from "@prisma/client";
import { Piece, PieceContext, PieceOptions } from "@sapphire/framework";

export interface PrismaHookManagerOptions<Type extends Prisma.ModelName> extends PieceOptions {
	name: Type;
	prisma: PrismaClient[Lowercase<Type>];
}

type BeforeFunction = (params: Prisma.MiddlewareParams) => Prisma.MiddlewareParams;
type AfterFunction = (result: any) => any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PrismaHookManager<Type extends Prisma.ModelName> {
	beforeFindUnique?: BeforeFunction;
	afterFindUnique?: AfterFunction;
	beforeFindMany?: BeforeFunction;
	afterFindMany?: AfterFunction;
	beforeFindFirst?: BeforeFunction;
	afterFindFirst?: AfterFunction;
	beforeCreate?: BeforeFunction;
	afterCreate?: AfterFunction;
	beforeCreateMany?: BeforeFunction;
	afterCreateMany?: AfterFunction;
	beforeUpdate?: BeforeFunction;
	afterUpdate?: AfterFunction;
	beforeUpdateMany?: BeforeFunction;
	afterUpdateMany?: AfterFunction;
	beforeUpsert?: BeforeFunction;
	afterUpsert?: AfterFunction;
	beforeDelete?: BeforeFunction;
	afterDelete?: AfterFunction;
	beforeDeleteMany?: BeforeFunction;
	afterDeleteMany?: AfterFunction;
	beforeExecuteRaw?: BeforeFunction;
	afterExecuteRaw?: AfterFunction;
	beforeQueryRaw?: BeforeFunction;
	afterQueryRaw?: AfterFunction;
	beforeAggregate?: BeforeFunction;
	afterAggregate?: AfterFunction;
	beforeCount?: BeforeFunction;
	afterCount?: AfterFunction;
	beforeRunCommandRaw?: BeforeFunction;
	afterRunCommandRaw?: AfterFunction;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export abstract class PrismaHookManager<Type extends Prisma.ModelName> extends Piece<PrismaHookManagerOptions<Type>> {
	public readonly prisma: PrismaClient[Lowercase<Type>];

	public constructor(context: PieceContext, options: PrismaHookManagerOptions<Type>) {
		super(context, options);
		this.prisma = options.prisma;
	}

	public override onLoad(): void  {
		this.container.logger.info(`--- Loading hooks for ${this.name} ---`);
		this.addHook("findUnique", this.beforeFindUnique, this.afterFindUnique);
		this.addHook("findMany", this.beforeFindMany, this.afterFindMany);
		this.addHook("findFirst", this.beforeFindFirst, this.afterFindFirst);
		this.addHook("create", this.beforeCreate, this.afterCreate);
		this.addHook("createMany", this.beforeCreateMany, this.afterCreateMany);
		this.addHook("update", this.beforeUpdate, this.afterUpdate);
		this.addHook("updateMany", this.beforeUpdateMany, this.afterUpdateMany);
		this.addHook("upsert", this.beforeUpsert, this.afterUpsert);
		this.addHook("delete", this.beforeDelete, this.afterDelete);
		this.addHook("deleteMany", this.beforeDeleteMany, this.afterDeleteMany);
		this.addHook("executeRaw", this.beforeExecuteRaw, this.afterExecuteRaw);
		this.addHook("queryRaw", this.beforeQueryRaw, this.afterQueryRaw);
		this.addHook("aggregate", this.beforeAggregate, this.afterAggregate);
		this.addHook("count", this.beforeCount, this.afterCount);
		this.addHook("runCommandRaw", this.beforeRunCommandRaw, this.afterRunCommandRaw);
		this.container.logger.info(`--- Finished loading hooks for ${this.name} ---`);
	}

	private addHook(action: Prisma.PrismaAction, before?: BeforeFunction, after?: AfterFunction) {
		this.container.logger.info(`Adding hook for ${this.name}.${action}`);
		this.container.prisma.$use(async (params, next) => {
			if (params.action !== action || params.model !== this.name) return next(params);

			params = before?.call(this, params) ?? params;
			const result = next(params);
			after?.call(this, await result);

			return result;
		});
		this.container.logger.info(`Added hook for ${this.name}.${action}`);
	}
}

export namespace PrismaHookManager {
	export interface Options<Type extends Prisma.ModelName> extends PrismaHookManagerOptions<Type> {}
}
