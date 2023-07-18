import { DeliveryMethod, OrderStatus } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, Colors } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";
import { ChannelType } from "discord-api-types/v10";

@ApplyOptions<Command.Options>({
	description: "get invite link of a guild by order",
	preconditions: ["DelivererOnly", "ValidOrderData"]
})
export class BackdoorCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("order").setRequired(true).setDescription("The order to cook").setAutocomplete(true)
			),
			{
				idHints: ["992383494640644126", "992383494640644126", "946548121134039090", "946548122291666984"]
			}
		);
	}

	public override autocompleteRun(interaction: AutocompleteInteraction) {
		return this.autocompleteOrder(interaction, (focused) => ({
			where: {
				OR: [
					{
						id: {
							startsWith: focused
						}
					},
					{
						order: {
							contains: focused
						}
					}
				],
				deliverer: interaction.user.id,
				status: OrderStatus.DELIVERED,
				deliveryMethod: DeliveryMethod.PERSONAL
			},
			orderBy: {
				id: "asc"
			}
		}));
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const order = await this.getOrder(interaction, {
			deliverer: interaction.user.id,
			status: OrderStatus.DELIVERED,
			deliveryMethod: DeliveryMethod.PERSONAL
		});

		const channel = await this.container.client.channels.fetch(order.channel);

		if (!channel?.isTextBased() || channel.type === ChannelType.DM || channel.isThread()) throw new Error("Invalid channel");

		const invite = await channel.createInvite({
			maxAge: 0,
			maxUses: 1,
			reason: `Deliverer ${interaction.user.tag} generated new invite for order ${order.id}`
		});

		await interaction.editReply({
			embeds: [new EmbedBuilder().setColor(Colors.Blue).setTitle("Invite link").setDescription(invite.url)]
		});
	}
}
