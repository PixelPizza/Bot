import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { codeBlock } from "@discordjs/builders";
import { type Message, Colors, ChatInputCommandInteraction, ComponentType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } from "discord.js";
import { OrderCommand as Command } from "../lib/commands/OrderCommand";

@ApplyOptions<Command.Options>({
    description: "Set your delivery message",
    preconditions: ["DelivererOnly"]
})
export class DeliveryMessageCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        this.registerPrivateChatInputCommand(
            registry,
            this.defaultChatInputCommand
                .addStringOption((input) => input.setName("message").setDescription("Your delivery message"))
        );
    }

    private readonly requirements: ({
        regex: string;
        name: string;
    } | string)[] = [
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

    public override async chatInputRun(interaction: ChatInputCommandInteraction): Promise<any> {
        await interaction.deferReply({ ephemeral: true });

        const message = interaction.options.getString("message");
        const [deliverer] = await this.container.stores.get("models").get("user").findOrCreate({
            where: { id: interaction.user.id },
            defaults: { id: interaction.user.id }
        });

        if (!message) {
            const currentMessage = deliverer.deliveryMessage ?? this.defaultDeliveryMessage;
            const reply = await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Blue)
                        .setTitle("Current Delivery Message")
                        .setDescription(codeBlock(currentMessage))
                ],
                components: [
                    new ActionRowBuilder<SelectMenuBuilder>().addComponents(
                        new SelectMenuBuilder()
                            .setCustomId("message")
                            .addOptions(
                                {
                                    label: "Normal",
                                    value: "normal",
                                    default: true
                                },
                                {
                                    label: "Colored",
                                    value: "colored"
                                }
                            )
                    )
                ]
            }) as Message;
            reply.createMessageComponentCollector({componentType: ComponentType.SelectMenu, filter: (selectMenu) => selectMenu.customId === "message"}).on("collect", async (interaction) => {
                const normal = interaction.values[0] === "normal";
                await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Blue)
                            .setTitle("Current Delivery Message")
                            .setDescription(normal ? codeBlock(currentMessage) : codeBlock("ansi", currentMessage)
                            .replace(/{(image|invite|orderID|order|guild|server|channel|chef|deliverer|customer|orderdate|cookdate|deliverydate)}/g, (_r, match) => `\x1b[0;34m{\x1b[0;32m${match}\x1b[0;34m}\x1b[0m`)
                            .replace(/{(chef|deliverer|customer)(?:: *(tag|id|username|name|ping|mention))}/g, (_r, name, type) => `\x1b[0;34m{\x1b[0;32m${name}\x1b[0;36m:\x1b[0;33m${type}\x1b[0;34m}\x1b[0m`)
                            .replace(/{(orderdate|cookdate|deliverydate)(?:: *(date|time|datetime))}/g, (_r, name, type) => `\x1b[0;34m{\x1b[0;32m${name}\x1b[0;36m:\x1b[0;33m${type}\x1b[0;34m}\x1b[0m`)).toJSON()
                    ],
                    components: [
                        new ActionRowBuilder<SelectMenuBuilder>().addComponents(
                            new SelectMenuBuilder()
                                .setCustomId("message")
                                .addOptions(
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
                                )
                        )
                    ]
                });
            });
            return;
        }

        const missing: string[] = [];
        this.requirements.forEach(requirement => {
            const isString = typeof requirement === "string";
            if (!(message.match(new RegExp(isString ? requirement : requirement.regex, "g")) || []).length)
                missing.push(isString ? requirement : requirement.name);
        });

        if (missing.length) {
            throw new Error(`Your delivery message is missing the following: ${missing.join(", ")}`);
        }

        await deliverer.update({
            deliveryMessage: message.replaceAll("\\n", "\n")
        });

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setTitle("Delivery Message Set")
                    .setDescription("Your delivery message has been set")
            ]
        });
    }
}