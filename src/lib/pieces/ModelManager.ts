import { container, Piece, PieceContext, PieceOptions } from "@sapphire/framework";
import { BulkCreateOptions, CountOptions, CreateOptions, DestroyOptions, FindAndCountOptions, FindOptions, FindOrCreateOptions, GroupOption, Identifier, InitOptions, Model as SequelizeModel, ModelAttributes, ModelStatic, TruncateOptions, UpdateOptions } from "sequelize";
import type { Col, Fn, Literal } from "sequelize/types/utils";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export class Model<TModelAttributes = any, TCreationAttributes = TModelAttributes> extends SequelizeModel<TModelAttributes, TCreationAttributes> {
    public readonly container = container;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export abstract class ModelManager<ModelClass extends Model<ModelClass["_attributes"], ModelClass["_creationAttributes"]>> extends Piece<ModelManagerOptions<ModelClass>> {
    private readonly model: ModelStatic<ModelClass>;
    
    public constructor(context: PieceContext, options: ModelManagerOptions<ModelClass>) {
        super(context, options);
        this.model = options.model.init(options.attributes, {
            sequelize: this.container.database,
            modelName: this.name,
            ...options.initOptions
        });
    }

    public override async onLoad() {
        await this.model.sync({ force: this.options.forceSync ?? false });
        return super.onLoad();
    }

    public bulkCreate(records: readonly ModelClass["_creationAttributes"][], options?: BulkCreateOptions<ModelClass["_attributes"]>) {
        return this.model.bulkCreate(records, options);
    }

    public count(options?: CountOptions<ModelClass["_attributes"]>) {
        return this.model.count(options);
    }

    public create(values?: ModelClass["_creationAttributes"], options?: CreateOptions<ModelClass["_attributes"]>) {
        return this.model.create(values, options);
    }

    public describe() {
        return this.model.describe();
    }

    public destroy(options?: DestroyOptions<ModelClass["_attributes"]>) {
        return this.model.destroy(options);
    }

    public findAll(options?: FindOptions<ModelClass["_attributes"]>) {
        return this.model.findAll(options);
    }

    public findAndCountAll(options?: (FindAndCountOptions<ModelClass["_attributes"]> & { group: GroupOption })) {
        return this.model.findAndCountAll(options);
    }

    public findByPk(identifier?: Identifier, options?: Omit<FindOptions<ModelClass["_attributes"]>, "where">) {
        return this.model.findByPk(identifier, options);
    }

    public findCreateFind(options: FindOrCreateOptions<ModelClass["_attributes"], ModelClass["_creationAttributes"]>) {
        return this.model.findCreateFind(options);
    }

    public findOne(options?: FindOptions<ModelClass["_attributes"]>) {
        return this.model.findOne(options);
    }

    public findOrBuild(options: FindOrCreateOptions<ModelClass["_attributes"], ModelClass["_creationAttributes"]>) {
        return this.model.findOrBuild(options);
    }

    public findOrCreate(options: FindOrCreateOptions<ModelClass["_attributes"], ModelClass["_creationAttributes"]>) {
        return this.model.findOrCreate(options);
    }

    public restore(options?: DestroyOptions<ModelClass["_attributes"]>) {
        return this.model.restore(options);
    }

    public truncate(options?: TruncateOptions<ModelClass["_attributes"]>) {
        return this.model.truncate(options);
    }

    public update(values: { [key in keyof ModelClass["_attributes"]]?: Fn | Col | Literal | ModelClass["_attributes"][key]; }, options: UpdateOptions<ModelClass["_attributes"]>) {
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
    model: ModelStatic<ModelClass>;
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