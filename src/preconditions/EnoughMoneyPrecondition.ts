import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
	name: "EnoughMoney"
})
export class EnoughMoneyPrecondition extends Precondition {
	public override async chatInputRun(interaciton: CommandInteraction) {
		const { balance } = await this.container.findOrCreateUser(interaciton.user.id);

		return balance >= this.container.env.integer("ORDER_PRICE")
			? this.ok()
			: this.error({
					message: stripIndents`
				You do not have enough money to order.
				Use \`/work\` or vote for the bot to get money.
			`
			  });
	}
}
