import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
	name: "NotManager"
})
export class NotManagerPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user");

        if (user && this.container.env.array("BOT_MANAGERS").includes(user.id)) {
            return this.error({ message: "Can not use this action on this user" });
        }

        return this.ok();
	}
}

declare module "@sapphire/framework" {
	interface Preconditions {
		NotBlacklisted: never;
	}
}
