import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, type PreconditionOptions } from "@sapphire/framework";
import type { CommandInteraction, GuildMember } from "discord.js";

@ApplyOptions<PreconditionOptions>({
	name: "ChefOnly"
})
export class ChefOnlyPrecondition extends Precondition {
	public override chatInputRun(interaction: CommandInteraction) {
		return (interaction.member as GuildMember).roles.cache.has(this.container.env.string("CHEF_ROLE"))
			? this.ok()
			: this.error({ message: "This command is for chefs only" });
	}
}
