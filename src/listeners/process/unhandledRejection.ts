import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
	emitter: process,
	event: "unhandledRejection"
})
export class UnhandledRejectionListener extends Listener {
	public override run(reason: unknown, promise: Promise<any>): void {
		this.container.logger.error("Unhandled rejection:", promise, "reason:", reason);
	}
}
