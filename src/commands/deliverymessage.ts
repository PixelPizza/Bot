import { codeBlock } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import {
	type ChatInputCommandInteraction,
	ActionRowBuilder,
	SelectMenuBuilder,
	EmbedBuilder,
	ModalBuilder,
	Colors, TextInputBuilder
} from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";
import { TextInputStyle } from "discord-api-types/v10";

@ApplyOptions<Command.Options>({
	description: "Set your delivery message",
	preconditions: ["DelivererOnly"]
})
export class DeliveryMessageCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand
				.addSubcommand((input) => input.setName("show").setDescription("Show your current delivery message"))
				.addSubcommand((input) => input.setName("set").setDescription("Set your delivery message"))
		);
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case "show":
				return this.chatInputShow(interaction);
			case "set":
				return this.chatInputSet(interaction);
		}
	}

	public async chatInputShow(interaction: ChatInputCommandInteraction): Promise<any> {
		await interaction.deferReply({ ephemeral: true });

		const deliverer = await this.container.stores.get("models").get("user").findOrCreate(interaction.user.id);
		const currentMessage = deliverer?.deliveryMessage ?? this.defaultDeliveryMessage;
		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blue)
					.setTitle("Current Delivery Message")
					.setDescription(codeBlock(currentMessage))
			],
			components: [
				new ActionRowBuilder<SelectMenuBuilder>().addComponents(
					new SelectMenuBuilder().setCustomId("deliverymessage/show").addOptions([
						{
							label: "Normal",
							value: "normal",
							default: true
						},
						{
							label: "Colored",
							value: "colored"
						}
					])
				)
			]
		});
	}

	public async chatInputSet(interaction: ChatInputCommandInteraction) {
		const deliverer = await this.container.stores.get("models").get("user").findOrCreate(interaction.user.id);
		const currentMessage = deliverer?.deliveryMessage ?? this.defaultDeliveryMessage;

		return interaction.showModal(
			new ModalBuilder()
				.setCustomId("deliverymessage/set")
				.setTitle("Delivery Message")
				.setComponents(
					new ActionRowBuilder<TextInputBuilder>().setComponents(
						new TextInputBuilder()
							.setCustomId("message")
							.setLabel("delivery message")
							.setMinLength(50)
							.setPlaceholder("Enter your delivery message")
							.setRequired(true)
							.setStyle(TextInputStyle.Paragraph)
							.setValue(currentMessage)
					)
				)
		);
	}
}
