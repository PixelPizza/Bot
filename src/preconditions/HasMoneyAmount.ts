import { Precondition } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

export class HasOrderPrecondition extends Precondition {
	public override async chatInputRun(interaciton: CommandInteraction) {
		const amount = interaciton.options.getInteger("amount");

		if (!amount) return this.ok();

		const { balance } = await this.container.stores.get("models").get("user").findOrCreate(interaciton.user.id);

		return balance >= amount ? this.ok() : this.error({ message: "You do not have enough money for this action" });
	}
}
