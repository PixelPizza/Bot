import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { codeBlock } from "@discordjs/builders";
import {
	type CommandInteraction,
	type Message,
	MessageActionRow,
	MessageSelectMenu,
	type WebhookEditMessageOptions,
	MessageEmbed
} from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";
import { Time } from "@sapphire/time-utilities";

@ApplyOptions<Command.Options>({
	description: "Set your delivery message",
	preconditions: ["DelivererOnly"],
	cooldownDelay: Time.Second * 5
})
export class DeliveryMessageCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
		this.registerPrivateChatInputCommand(
			registry,
			this.defaultChatInputCommand.addStringOption((input) =>
				input.setName("message").setDescription("Your delivery message")
			)
		);
	}

	private readonly requirements: (
		| {
				regex: string;
				name: string;
		  }
		| string
	)[] = [
		{
			regex: `{${this.chefRegex}}`,
			name: "{chef}"
		},
		{
			regex: `{${this.customerRegex}}`,
			name: "{customer}"
		},
		`{image}`,
		`{invite}`
	];

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const message = interaction.options.getString("message");
		const deliverer = await this.container.findOrCreateUser(interaction.user.id);

		if (!message) {
			const currentMessage = deliverer.deliveryMessage ?? this.defaultDeliveryMessage;
			const replyOptions: WebhookEditMessageOptions & { embeds: MessageEmbed[]; components: MessageActionRow[] } = {
				embeds: [
					new MessageEmbed()
						.setColor("BLUE")
						.setTitle("Current Delivery Message")
						.setDescription(codeBlock(currentMessage))
				],
				components: [
					new MessageActionRow().addComponents(
						new MessageSelectMenu().setCustomId("message").addOptions([
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
			};
			const reply = (await interaction.editReply(replyOptions)) as Message;
			reply
				.createMessageComponentCollector({
					componentType: "SELECT_MENU",
					filter: (selectMenu) => selectMenu.customId === "message"
				})
				.on("collect", async (interaction) => {
					const normal = interaction.values[0] === "normal";
					replyOptions.embeds[0].setDescription(
						normal
							? codeBlock(currentMessage)
							: codeBlock("ansi", currentMessage)
									.replace(
										/{(image|invite|orderID|order|guild|server|channel|chef|deliverer|customer|orderdate|cookdate|deliverydate)}/g,
										(_r, match) => `\x1b[0;34m{\x1b[0;32m${match}\x1b[0;34m}\x1b[0m`
									)
									.replace(
										/{(chef|deliverer|customer)(?:: *(tag|id|username|name|ping|mention))}/g,
										(_r, name, type) => `\x1b[0;34m{\x1b[0;32m${name}\x1b[0;36m:\x1b[0;33m${type}\x1b[0;34m}\x1b[0m`
									)
									.replace(
										/{(orderdate|cookdate|deliverydate)(?:: *(date|time|datetime))}/g,
										(_r, name, type) => `\x1b[0;34m{\x1b[0;32m${name}\x1b[0;36m:\x1b[0;33m${type}\x1b[0;34m}\x1b[0m`
									)
					);
					(replyOptions.components[0].components[0] as MessageSelectMenu).setOptions([
						{
							label: "Normal",
							value: "normal",
							default: normal
						},
						{
							label: "Colored",
							value: "colored",
							default: !normal
						}
					]);
					await interaction.update(replyOptions);
				});
			return;
		}

		const missing: string[] = [];
		this.requirements.forEach((requirement) => {
			const isString = typeof requirement === "string";
			if (!(message.match(new RegExp(isString ? requirement : requirement.regex, "g")) || []).length)
				missing.push(isString ? requirement : requirement.name);
		});

		if (missing.length) {
			throw new Error(`Your delivery message is missing the following: ${missing.join(", ")}`);
		}

		await this.container.prisma.user.update({
			where: { id: deliverer.id },
			data: {
				deliveryMessage: message.replaceAll("\\n", "\n")
			}
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("GREEN")
					.setTitle("Delivery Message Set")
					.setDescription("Your delivery message has been set")
			]
		});
	}
}
