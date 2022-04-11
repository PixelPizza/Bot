import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";
import { Op } from "sequelize";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
    description: "get invite link of a guild by order",
    preconditions: ["DelivererOnly", "ValidOrderData"]
})
export class BackdoorCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry): void  {
        this.registerPrivateChatInputCommand(registry,
            this.defaultChatInputCommand
                .addStringOption((input) => input.setName("order").setRequired(true).setDescription("The order to cook").setAutocomplete(true))
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
				deliverer: interaction.user.id,
				status: "delivered",
                deliveryMethod: "personal"
			},
			order: [["id", "ASC"]]
		}));
	}

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const order = await this.getOrder(interaction, {
            deliverer: interaction.user.id,
            status: "delivered",
            deliveryMethod: "personal"
        });

        const invite = await (await order.fetchChannel(true)).createInvite({ maxAge: 0, maxUses: 1, reason: `Deliverer ${interaction.user.tag} generated new invite for order ${order.id}` });

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("Invite link")
                    .setDescription(invite.url)
            ]
        });
    }
}