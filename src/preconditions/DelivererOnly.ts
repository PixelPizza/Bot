import { Precondition } from "@sapphire/framework";
import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export class DelivererOnlyPrecondition extends Precondition {
	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		return (interaction.member as GuildMember).roles.cache.hasAny(...this.container.env.array("DELIVERER_ROLES")) ? this.ok() : this.error({ message: "This command is for deliverers only" });
	}
}
