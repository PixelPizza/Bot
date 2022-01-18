import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, type PreconditionOptions } from "@sapphire/framework";
import type { CommandInteraction, GuildMember } from "discord.js";

@ApplyOptions<PreconditionOptions>({
	name: "DelivererOnly"
})
export class DelivererOnlyPrecondition extends Precondition {
	public override chatInputRun(interaction: CommandInteraction) {
		return (interaction.member as GuildMember).roles.cache.has(process.env.DELIVERER_ROLE)
			? this.ok()
			: this.error({ message: "This command is for deliverers only" });
	}
}
