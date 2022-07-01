import { Precondition } from "@sapphire/framework";
import type { CommandInteraction, GuildMember } from "discord.js";

export class DelivererOnlyPrecondition extends Precondition {
	public override chatInputRun(interaction: CommandInteraction) {
		return (interaction.member as GuildMember).roles.cache.has(this.container.env.string("DELIVERER_ROLE"))
			? this.ok()
			: this.error({ message: "This command is for deliverers only" });
	}
}
