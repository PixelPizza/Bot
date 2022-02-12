import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Precondition, PreconditionOptions, PreconditionStore } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";
import { OrderCommand } from "../lib/commands/OrderCommand";

@ApplyOptions<PreconditionOptions>({
    name: "ValidClaimType"
})
export class ValidClaimTypePrecondition extends Precondition {
    public override chatInputRun(interaction: CommandInteraction, command: ChatInputCommand) {
        const type = interaction.options.getString("type", true) as OrderCommand.ClaimType;
        const store = this.store as PreconditionStore;

        return store.get(type === OrderCommand.ClaimType.Cooking ? "ChefOnly" : "DelivererOnly")!
            .chatInputRun!(interaction, command, { external: true });
    }
}