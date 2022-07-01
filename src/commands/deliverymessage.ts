import { codeBlock } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import {
	type CommandInteraction,
	MessageActionRow,
	MessageSelectMenu,
	MessageEmbed,
	Modal,
	TextInputComponent
} from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

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

	public override async chatInputRun(interaction: CommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case "show":
				return this.chatInputShow(interaction);
			case "set":
				return this.chatInputSet(interaction);
		}
	}

	public async chatInputShow(interaction: CommandInteraction): Promise<any> {
		await interaction.deferReply({ ephemeral: true });

		const deliverer = await this.container.stores.get("models").get("user").findOrCreate(interaction.user.id);
		const currentMessage = deliverer.deliveryMessage ?? this.defaultDeliveryMessage;
		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Current Delivery Message")
					.setDescription(codeBlock(currentMessage))
			],
			components: [
				new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId("deliverymessage/show").addOptions([
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

	public async chatInputSet(interaction: CommandInteraction) {
		const deliverer = await this.container.stores.get("models").get("user").findOrCreate(interaction.user.id);
		const currentMessage = deliverer.deliveryMessage ?? this.defaultDeliveryMessage;

		return interaction.showModal(
			new Modal()
				.setCustomId("deliverymessage/set")
				.setTitle("Delivery Message")
				.setComponents(
					new MessageActionRow<TextInputComponent>().setComponents(
						new TextInputComponent()
							.setCustomId("message")
							.setLabel("delivery message")
							.setMinLength(50)
							.setPlaceholder("Enter your delivery message")
							.setRequired(true)
							.setStyle("PARAGRAPH")
							.setValue(currentMessage)
					)
				)
		);
	}
}
