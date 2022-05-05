import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
	name: "UserExists"
})
export class HasOrderPrecondition extends Precondition {
	public override async chatInputRun(interaciton: CommandInteraction) {
		const user = interaciton.options.getUser("user");

        if (!user || !(await this.container.prisma.user.findUnique({ where: { id: user.id } })))
            return this.error({ message: "Unknown user" });
        return this.ok();
	}
}
