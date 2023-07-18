import { ApplyOptions } from "@sapphire/decorators";
import { Precondition } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";

@ApplyOptions<Precondition.Options>({
	position: 1
})
export class NotBlacklistedPrecondition extends Precondition {
	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		return (await this.container.stores
			.get("models")
			.get("blacklist")
			.findUnique({
				where: {
					user: interaction.user.id
				}
			}))
			? this.error({ message: "You are blacklisted" })
			: this.ok();
	}
}
