import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
    description: "stop the bot",
    requiredUserPermissions: ["ADMINISTRATOR"]
})
export class StopCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        this.registerPrivateChatInputCommand(registry);
    }

    public override async chatInputRun(interaction: CommandInteraction) {
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Stopping")
                    .setDescription("Stopping the bot")
            ],
            ephemeral: true
        });

        this.container.client.destroy();
        process.exit();
    }
}