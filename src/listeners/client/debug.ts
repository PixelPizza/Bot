import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
	event: "debug"
})
export class DebugListener extends Listener<"debug"> {
	public run(info: string): void {
		this.container.logger.debug(info);
	}
}
