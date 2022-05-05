import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
    description: "Show the order menu"
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
        registry.registerChatInputCommand(this.defaultChatInputCommand);
    }

    public override chatInputRun(interaction: CommandInteraction) {
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("Menu")
                    .setDescription("Here are some examples of what to order")
                    .addFields(...this.items.map(item => ({
                        name: item.name,
                        value: item.items.map(subItem => `${subItem.name}${item.suffix ?? ""}`).join("\n")
                    })))
            ],
            ephemeral: true
        });
    }
}