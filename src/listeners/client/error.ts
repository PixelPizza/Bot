import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
	event: Events.Error
})
export class ErrorListener extends Listener<typeof Events.Error> {
	public run(error: Error): void {
		this.container.logger.error(error);
	}
}
