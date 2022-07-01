import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
	event: "warn"
})
export class DebugListener extends Listener<"warn"> {
	public run(warning: string): void {
		this.container.logger.warn(warning);
	}
}
