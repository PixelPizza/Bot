import { Events, Listener } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<Listener.Options>({
	event: Events.Debug
})
export class DebugListener extends Listener<typeof Events.Debug> {
	public run(info: string): void {
		this.container.logger.debug(info);
	}
}
