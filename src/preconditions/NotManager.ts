import { Precondition } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";

export class NotManagerPrecondition extends Precondition {
	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser("user");

		if (user && this.container.env.array("BOT_MANAGERS").includes(user.id)) {
			return this.error({ message: "Can not use this action on this user" });
		}

		return this.ok();
	}
}
