import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
    description: "Show your current balance.",
})
export class BalanceCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(this.defaultChatInputCommand, { idHints: ["955071815913472001"] });
    }

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const user = await this.container.prisma.user.findFirst({ where: { id: interaction.user.id } }) ?? await this.container.prisma.user.create({ data: { id: interaction.user.id } });

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle(`${interaction.user.username}'s balance`)
                    .setDescription(`${this.container.client.emojis.cache.get(this.container.env.string("ECO_EMOJI"))!.toString()} ${user.balance}`)
            ]
        });
    }
}