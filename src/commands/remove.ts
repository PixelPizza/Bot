import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { Op } from "sequelize";
import { Command } from "../lib/Command";

@ApplyOptions<CommandOptions>({
    description: "Remove an order",
    preconditions: [["ChefOnly"], ["DelivererOnly"]]
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

    public override async autocompleteRun(interaction: AutocompleteInteraction) {
        const focused = interaction.options.getFocused() as string;
        const found = await this.container.stores
            .get("models")
            .get("order")
            .findAll({
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
            });
        return interaction.respond(
            found
                .map((order) => {
                    const id = order.getDataValue("id");
                    return { name: `${id} - ${order.getDataValue("order")}`, value: id };
                })
        );
    }

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply();

        const reason = interaction.options.getString("reason", true);

        const order = await this.container.stores
            .get("models")
            .get("order")
            .findOne({
                where: {
                    id: interaction.options.getString("order", true)
                }
            });

        if (!order) {
            return interaction.editReply({
                embeds: [{
                    color: "RED",
                    title: "Order not found",
                    description: "The order you specified does not exist"
                }]
            });
        }

        await order.update({
            status: "deleted",
            deleteReason: reason
        });

        return interaction.editReply({
            embeds: [{
                color: "GREEN",
                title: "Order removed",
                description: `Order ${order.getDataValue("id")} has been removed`,
                fields: [{
                    name: "Reason",
                    value: reason
                }]
            }]
        });
    }
}