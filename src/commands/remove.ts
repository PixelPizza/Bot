import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";
import { Op } from "sequelize";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
    description: "Remove an order",
    preconditions: [["ChefOnly"], ["DelivererOnly"], "ExistingOrder"]
})
export class RemoveCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        this.registerPrivateChatInputCommand(
            registry,
            this.defaultChatInputCommand
                .addStringOption((input) => input.setName("order").setDescription("The order to remove").setRequired(true).setAutocomplete(true))
                .addStringOption((input) => input.setName("reason").setDescription("The reason to remove").setRequired(true))
        );
    }

    public override autocompleteRun(interaction: AutocompleteInteraction) {
        return this.autocompleteOrder(interaction, (focused) => ({
            where: {
                [Op.or]: {
                    id: {
                        [Op.startsWith]: focused
                    },
                    order: {
                        [Op.substring]: focused
                    }
                },
                status: {
                    [Op.or]: ["uncooked", "cooked"]
                }
            },
            order: [["id", "ASC"]]
        }));
    }

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply();

        const reason = interaction.options.getString("reason", true);

        const order = await this.getOrder(interaction);

        await order.update({
            status: "deleted",
            deleteReason: reason
        });

        await order.sendCustomerMessage({
            embeds: [
                new MessageEmbed({
                    color: "RED",
                    title: "Order removed",
                    description: "Your order has been removed. if you think your order has been incorrectly removed, please contact a staff member in our server.",
                    fields: [{
                        name: "Reason",
                        value: reason
                    }]
                })
            ]
        });

        return interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: "Order removed",
                    description: `Order ${order.id} has been removed`,
                    fields: [{
                        name: "Reason",
                        value: reason
                    }]
                })
            ]
        });
    }
}