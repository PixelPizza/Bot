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
	P extends {
		attributes: ModelAttributes;
		types: { [key in keyof P["attributes"]]: any };
	} = {
		attributes: ModelAttributes;
		types: Record<string, never>;
	}
> extends Piece {
	public declare readonly options: ModelPieceOptions<P["attributes"]>;
	private readonly model: ModelCtor<Model<P["types"]>>;

	public constructor(context: PieceContext, options: ModelPieceOptions<P["attributes"]>) {
		super(context, options);
		const { name, attributes, options: modelOptions } = this.options;
		this.model = container.database.define(name, attributes, {
			...modelOptions,
			createdAt: false,
			updatedAt: false
		});
		void this.model.sync({ force: true });
	}

	public findAll(options?: FindOptions<P["types"]>) {
		return this.model.findAll(options);
	}

	public findByPk(id?: Identifier, options?: Omit<FindOptions<P["types"]>, "where">) {
		return this.model.findByPk(id, options);
	}

	public findOne(options?: FindOptions<P["types"]>) {
		return this.model.findOne(options);
	}

	public create(values?: P["types"], options?: CreateOptions<P["types"]>) {
		return this.model.create(values, options);
	}

	public findOrCreate(options: FindOrCreateOptions<P["types"]>) {
		return this.model.findOrCreate(options);
	}

	public bulkCreate(records: readonly P["types"][], options?: BulkCreateOptions<P["types"]>) {
		return this.model.bulkCreate(records, options);
	}

	public truncate(options?: TruncateOptions<P["types"]>) {
		return this.model.truncate(options);
	}

	public destroy(options?: DestroyOptions<P["types"]>) {
		return this.model.destroy(options);
	}

	public restore(options?: RestoreOptions<P["types"]>) {
		return this.model.restore(options);
	}

	public update(values: P["types"], options: UpdateOptions<P["types"]>) {
		return this.model.update(values, options);
	}
}

export interface ModelPieceOptions<P extends ModelAttributes = ModelAttributes> {
	name: string;
	attributes: P;
	options?: ModelOptions;
}
