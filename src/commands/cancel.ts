import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Colors, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
    description: "Cancel your order",
    preconditions: ["HasOrder"]
})
export class CancelCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(this.defaultChatInputCommand);
    }

    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        await (await this.orderModel.findOne({
            where: {
                customer: interaction.user.id,
                status: ["uncooked", "cooked"]
            }
        }))!.destroy();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Order cancelled")
                    .setDescription("Your order has been cancelled.")
            ]
        });
    }
}