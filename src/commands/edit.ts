import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
    description: "Edit your order",
    preconditions: ["HasUncookedOrder"]
})
export class EditCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(
            this.defaultChatInputCommand
                .addStringOption((input) => input.setName("order").setDescription("The new order").setRequired(true))
        );
    }

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const order = await (await this.orderModel.findOne({
            where: {
                customer: interaction.user.id,
                status: "uncooked"
            }
        }))!.update({
            order: interaction.options.getString("order", true)
        });

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Order edited")
                    .setDescription("Your order has been edited.")
                    .addField("Your order", order.order)
            ]
        });
    }
}