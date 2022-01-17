import { Piece, PieceContext, container } from "@sapphire/framework";
import type {
	BulkCreateOptions,
	CreateOptions,
	DestroyOptions,
	FindOptions as SequelizeFindOptions,
	FindOrCreateOptions,
	Identifier,
	Model,
	ModelAttributes,
	ModelCtor,
	ModelOptions,
	NonNullFindOptions,
	RestoreOptions,
	TruncateOptions,
	UpdateOptions
} from "sequelize";

type FindOptions<P extends ModelAttributes = ModelAttributes> = SequelizeFindOptions<P> | NonNullFindOptions<P>;

export abstract class ModelPiece<
	Attributes extends ModelAttributes = ModelAttributes,
	Types extends { [key in keyof Attributes]: any } = { [key in keyof Attributes]: any },
	CreateTypes extends { [key in keyof Types]?: Types[key] } = Types
> extends Piece {
	public declare readonly options: ModelPieceOptions<Attributes>;
	private readonly model: ModelCtor<Model<Types, CreateTypes>>;

	public constructor(context: PieceContext, options: ModelPieceOptions<Attributes>) {
		super(context, options);
		const { name, attributes, options: modelOptions } = this.options;
		this.model = container.database.define(name, attributes, {
			...modelOptions,
			createdAt: false,
			updatedAt: false
		});
		void this.model.sync({ force: false });
	}

	public findAll(options?: FindOptions<Types>) {
		return this.model.findAll(options);
	}

	public findByPk(id?: Identifier, options?: Omit<FindOptions<Types>, "where">) {
		return this.model.findByPk(id, options);
	}

	public findOne(options?: FindOptions<Types>) {
		return this.model.findOne(options);
	}

	public create(values?: CreateTypes, options?: CreateOptions<Types>) {
		return this.model.create(values, options);
	}

	public findOrCreate(options: FindOrCreateOptions<Types>) {
		return this.model.findOrCreate(options);
	}

	public bulkCreate<T extends Types>(records: readonly T[], options?: BulkCreateOptions<T>) {
		return this.model.bulkCreate(records, options);
	}

	public truncate(options?: TruncateOptions<Types>) {
		return this.model.truncate(options);
	}

	public destroy(options?: DestroyOptions<Types>) {
		return this.model.destroy(options);
	}

	public restore(options?: RestoreOptions<Types>) {
		return this.model.restore(options);
	}

	public update<T extends Types>(values: T, options: UpdateOptions<T>) {
		return this.model.update(values, options);
	}

	public abstract getData(model: Model<Types, CreateTypes>): Promise<{ [key in keyof Types]: unknown }>;
}

export interface ModelPieceOptions<P extends ModelAttributes = ModelAttributes> {
	name: string;
	attributes: P;
	options?: ModelOptions;
}
