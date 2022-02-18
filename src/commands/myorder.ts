import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";
import type { ChatInputCommandInteraction } from "discord.js";

@ApplyOptions<Command.Options>({
    description: "Show your order",
    preconditions: ["HasOrder"]
})
export class MyOrderCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(this.defaultChatInputCommand);
    }

    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const order = await this.orderModel.findOne({
            where: {
                customer: interaction.user.id,
                status: ["uncooked", "cooked"]
            }
        });

        await interaction.editReply({ embeds: [await order!.createOrderEmbed()] });
    }
}