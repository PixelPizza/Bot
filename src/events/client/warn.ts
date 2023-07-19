import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
	event: Events.Warn
})
export class DebugListener extends Listener<typeof Events.Warn> {
	public run(warning: string): void {
		this.container.logger.warn(warning);
	}
}
