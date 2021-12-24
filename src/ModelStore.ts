import { Store } from "@sapphire/framework";
import { ModelPiece } from "./pieces/Model";

export class ModelStore extends Store<ModelPiece> {
	public constructor() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		super(ModelPiece as any, { name: "models" });
	}
}
