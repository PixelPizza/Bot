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

export abstract class ModelPiece<P extends ModelAttributes = ModelAttributes> extends Piece {
	public declare readonly options: ModelPieceOptions<P>;
	private readonly model: ModelCtor<
		Model<{
			[key in keyof P]?: any;
		}>
	>;

	public constructor(context: PieceContext, options: ModelPieceOptions<P>) {
		super(context, options);
		const { name, attributes, options: modelOptions } = this.options;
		this.model = container.database.define(name, attributes, {
			...modelOptions,
			createdAt: false,
			updatedAt: false
		});
		void this.model.sync({ force: true });
	}

	public findAll(
		options?: FindOptions<{
			[key in keyof P]?: any;
		}>
	) {
		return this.model.findAll(options);
	}

	public findByPk(
		id?: Identifier,
		options?: Omit<
			FindOptions<{
				[key in keyof P]?: any;
			}>,
			"where"
		>
	) {
		return this.model.findByPk(id, options);
	}

	public findOne(
		options?: FindOptions<{
			[key in keyof P]?: any;
		}>
	) {
		return this.model.findOne(options);
	}

	public create(
		values?: {
			[key in keyof P]?: any;
		},
		options?: CreateOptions<{
			[key in keyof P]?: any;
		}>
	) {
		return this.model.create(values, options);
	}

	public findOrCreate(
		options: FindOrCreateOptions<{
			[key in keyof P]?: any;
		}>
	) {
		return this.model.findOrCreate(options);
	}

	public bulkCreate(
		records: readonly {
			[key in keyof P]?: any;
		}[],
		options?: BulkCreateOptions<{
			[key in keyof P]?: any;
		}>
	) {
		return this.model.bulkCreate(records, options);
	}

	public truncate(
		options?: TruncateOptions<{
			[key in keyof P]?: any;
		}>
	) {
		return this.model.truncate(options);
	}

	public destroy(
		options?: DestroyOptions<{
			[key in keyof P]?: any;
		}>
	) {
		return this.model.destroy(options);
	}

	public restore(
		options?: RestoreOptions<{
			[key in keyof P]?: any;
		}>
	) {
		return this.model.restore(options);
	}

	public update(
		values: {
			[key in keyof P]?: any;
		},
		options: UpdateOptions<{
			[key in keyof P]?: any;
		}>
	) {
		return this.model.update(values, options);
	}
}

export interface ModelPieceOptions<P extends ModelAttributes = ModelAttributes> {
	name: string;
	attributes: P;
	options?: ModelOptions;
}
