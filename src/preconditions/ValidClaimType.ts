import { ChatInputCommand, Precondition, PreconditionStore } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";
import { OrderCommand } from "../lib/commands/OrderCommand";

export class ValidClaimTypePrecondition extends Precondition {
	public override chatInputRun(interaction: ChatInputCommandInteraction, command: ChatInputCommand) {
		const type = interaction.options.getString("type", true) as OrderCommand.ClaimType;
		const store = this.store as PreconditionStore;

		return store.get(type === OrderCommand.ClaimType.Cooking ? "ChefOnly" : "DelivererOnly")!.chatInputRun!(
			interaction,
			command,
			{ external: true }
		);
	}
}
