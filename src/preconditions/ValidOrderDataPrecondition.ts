import { ApplyOptions } from "@sapphire/decorators";
import { ChatInputCommand, Precondition, PreconditionContext, PreconditionStore, type PreconditionOptions } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

@ApplyOptions<PreconditionOptions>({
    name: "ValidOrderData"
})
export class ValidOrderDataPrecondition extends Precondition {
    public override async chatInputRun(interaction: CommandInteraction, command: ChatInputCommand, context: PreconditionContext) {
        const store = this.store as PreconditionStore;
        const result = await store.get("ExistingOrder")!.chatInputRun!(interaction, command, context);
        if (!result.success) return result;
        const order = (await this.container.stores.get("models").get("order").findByPk(interaction.options.getString("order", true)))!;
        try {
            await order.fetchCustomer(true);
            await order.fetchGuild(true);
            await order.fetchChannel(true);
            return await this.ok();
        } catch {
            return this.error({ message: "Customer, guild or channel not found" })
        }
    }
}