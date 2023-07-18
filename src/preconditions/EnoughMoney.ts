import { Precondition } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import type { ChatInputCommandInteraction } from "discord.js";

export class EnoughMoneyPrecondition extends Precondition {
	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		const { balance = 0 } = await this.container.stores.get("models").get("user").findOrCreate(interaction.user.id) ?? {};

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
