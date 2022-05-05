import { Piece, PieceOptions } from "@sapphire/framework";

export interface PrismaModelManagerOptions extends PieceOptions {}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export abstract class PrismaModelManager extends Piece<PrismaModelManagerOptions> {}