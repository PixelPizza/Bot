import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { AutocompleteInteraction, Embed, Colors, ChatInputCommandInteraction } from "discord.js";
import { Op } from "sequelize";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
    description: "Change the image of an order",
    preconditions: ["ChefOnly", "ValidOrderData"]
})
export class ChangeCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        this.registerPrivateChatInputCommand(
            registry,
            this.defaultChatInputCommand
                .addStringOption((input) => input.setName("order").setRequired(true).setDescription("The order to change the image of").setAutocomplete(true))
                .addStringOption((input) =>
                    input.setName("image").setRequired(true).setDescription("The url of the image to use")
                )
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
                chef: interaction.user.id,
                status: "cooked"
            },
            order: [["id", "ASC"]]
        }));
    }

    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const order = await this.getOrder(interaction, { chef: interaction.user.id });
        const image = interaction.options.getString("image", true);

        if (!this.isImage(image)) {
            throw new Error("The image you specified is not a valid image.");
        }

        await interaction.editReply({
            embeds: [
                new Embed()
                    .setColor(Colors.DarkGreen)
                    .setTitle("Changing order image")
                    .setDescription(`Changing order ${order.id} image`)
            ]
        });

        const imageMessage = (await this.container.stores.get("webhooks").get("image").sendImage(image))!;

        await order.update({ image: imageMessage.attachments.first()!.url });

        await interaction.editReply({
            embeds: [
                new Embed()
                    .setColor(Colors.DarkGreen)
                    .setTitle("Order image changed")
                    .setDescription(`Order ${order.id} image changed`)
            ]
        });
    }
}