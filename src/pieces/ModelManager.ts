import { container, Piece, PieceContext, PieceOptions } from "@sapphire/framework";
import { BulkCreateOptions, CountOptions, CreateOptions, DestroyOptions, FindAndCountOptions, FindOptions, FindOrCreateOptions, GroupOption, Identifier, InitOptions, Model as SequelizeModel, ModelAttributes, ModelCtor, TruncateOptions, UpdateOptions } from "sequelize";
import type { Col, Fn, Literal } from "sequelize/types/lib/utils";

export interface Model {
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    getData?(): any | Promise<any>;
}

export class Model<TModelAttributes = any, TCreationAttributes = TModelAttributes> extends SequelizeModel<TModelAttributes, TCreationAttributes> {
    public readonly container = container;
}

export abstract class ModelManager<Attributes, CreationAttributes, ModelClass extends Model<Attributes, CreationAttributes>> extends Piece<ModelManagerOptions<ModelClass>> {
    private readonly model: ModelCtor<ModelClass>;
    
    public constructor(context: PieceContext, options: ModelManagerOptions<ModelClass>) {
        super(context, options);
        this.model = options.model.init(options.attributes, {
            sequelize: this.container.database,
            ...options.initOptions
        });
    }

    public override async onLoad() {
        await this.model.sync({ force: this.options.forceSync ?? false });
        return super.onLoad();
    }

    public bulkCreate(records: readonly CreationAttributes[], options?: BulkCreateOptions<Attributes>) {
        return this.model.bulkCreate(records, options);
    }

    public count(options?: CountOptions<Attributes>) {
        return this.model.count(options);
    }

    public create(values?: CreationAttributes, options?: CreateOptions<Attributes>) {
        return this.model.create(values, options);
    }

    public describe() {
        return this.model.describe();
    }

    public destroy(options?: DestroyOptions<Attributes>) {
        return this.model.destroy(options);
    }

    public findAll(options?: FindOptions<Attributes>) {
        return this.model.findAll(options);
    }

    public findAndCountAll(options?: (FindAndCountOptions<Attributes> & { group: GroupOption })) {
        return this.model.findAndCountAll(options);
    }

    public findByPk(identifier?: Identifier, options?: Omit<FindOptions<Attributes>, "where">) {
        return this.model.findByPk(identifier, options);
    }

    public findCreateFind(options: FindOrCreateOptions<Attributes, CreationAttributes>) {
        return this.model.findCreateFind(options);
    }

    public findOne(options?: FindOptions<Attributes>) {
        return this.model.findOne(options);
    }

    public findOrBuild(options: FindOrCreateOptions<Attributes, CreationAttributes>) {
        return this.model.findOrBuild(options);
    }

    public findOrCreate(options: FindOrCreateOptions<Attributes, CreationAttributes>) {
        return this.model.findOrCreate(options);
    }

    public restore(options?: DestroyOptions<Attributes>) {
        return this.model.restore(options);
    }

    public truncate(options?: TruncateOptions<Attributes>) {
        return this.model.truncate(options);
    }

    public update(values: { [key in keyof Attributes]?: Fn | Col | Literal | Attributes[key]; }, options: UpdateOptions<Attributes>) {
        return this.model.update(values, options);
    }
}

export interface ModelManagerOptions<ModelClass extends Model> extends PieceOptions {
    /**
     * The attributes of the model.
     */
    attributes: ModelAttributes<ModelClass, ModelClass["_attributes"]>;
    /**
     * The model to use.
     */
    model: ModelCtor<ModelClass>;
    /**
     * The options to initialize the model with.
     */
    initOptions?: Omit<InitOptions, "sequelize">;
    /**
     * Wether to force syncronize the model.
     * @default false
     */
    forceSync?: boolean;
}