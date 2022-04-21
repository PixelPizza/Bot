import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Interaction } from "discord.js";

@ApplyOptions<Listener.Options>({
	event: Events.InteractionCreate
})
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export class InteractionCreateListener extends Listener<typeof Events.InteractionCreate> {
	public run(interaction: Interaction): unknown {
		if (!interaction.isCommand()) return;

		return this.container.statcord.postCommand(interaction.commandName, interaction.user.id);
	}
}
