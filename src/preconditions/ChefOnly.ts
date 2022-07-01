import { Precondition } from "@sapphire/framework";
import type { CommandInteraction, GuildMember } from "discord.js";

export class ChefOnlyPrecondition extends Precondition {
	public override chatInputRun(interaction: CommandInteraction) {
		return (interaction.member as GuildMember).roles.cache.has(this.container.env.string("CHEF_ROLE"))
			? this.ok()
			: this.error({ message: "This command is for chefs only" });
	}
}
