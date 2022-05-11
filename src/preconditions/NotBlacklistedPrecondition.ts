import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
	name: "NotBlacklisted"
})
export class NotBlacklistedPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		return (await this.container.stores.get("models").get("blacklist").findUnique({
			where: {
				user: interaction.user.id
			}
		}))
			? this.error({ message: "You are blacklisted" })
			: this.ok();
	}
}
