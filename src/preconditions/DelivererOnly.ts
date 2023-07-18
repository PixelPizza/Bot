import { Precondition } from "@sapphire/framework";
import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

export class DelivererOnlyPrecondition extends Precondition {
	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		const roles = (interaction.member as GuildMember).roles.cache;
		for (const role of this.container.env.array("DELIVERER_ROLES")) {
			if (roles.has(role)) return this.ok();
		}
		return this.error({ message: "This command is for deliverers only" });
	}
}
