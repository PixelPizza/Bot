import { Events, Listener } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<Listener.Options>({
	event: Events.Error
})
export class ErrorListener extends Listener<typeof Events.Error> {
	public run(error: Error): void {
		this.container.logger.error(error);
	}
}
