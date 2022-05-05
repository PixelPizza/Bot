import {Precondition} from "@sapphire/framework";
import type {CommandInteraction} from "discord.js";

export class NotBlacklistedPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		return (await this.container.prisma.blacklist.findUnique({
			where: {
				user: interaction.user.id
			}
		}))
			? this.error({message: "You are blacklisted"})
			: this.ok();
	}
}

declare module "@sapphire/framework" {
	interface Preconditions {
		NotBlacklisted: never;
	}
}