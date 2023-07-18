import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Show the order menu",
	cooldownDelay: Time.Minute * 2
})
export class MenuCommand extends Command {
	private readonly items: {
		name: string;
		suffix?: string;
		items: {
			name: string;
		}[];
	}[] = [
		{
			name: "Pizza's",
			suffix: " Pizza",
			items: [
				{
					name: "Hawaï"
				},
				{
					name: "Tonno"
				},
				{
					name: "Pepperoni"
				},
				{
					name: "Salami"
				},
				{
					name: "Calzone"
				},
				{
					name: "Margherita"
				},
				{
					name: "BBQ Mixed Grill"
				},
				{
					name: "Chicken Kebab"
				},
				{
					name: "Shoarma"
				},
				{
					name: "Cheese"
				},
				{
					name: "Funghi"
				},
				{
					name: "Chocolate"
				}
			]
		},
		{
			name: "Burgers",
			items: [
				{
					name: "Cheeseburger"
				}
			]
		}
	];

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand, {
			idHints: ["992383595530428467", "974010005839835198"]
		});
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction) {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blue)
					.setTitle("Menu")
					.setDescription("Here are some examples of what to order")
					.addFields(
						...this.items.map((item) => ({
							name: item.name,
							value: item.items.map((subItem) => `${subItem.name}${item.suffix ?? ""}`).join("\n")
						}))
					)
			],
			ephemeral: true
		});
	}
}
