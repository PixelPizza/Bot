import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Embed, Colors, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
    description: "🖊🍍🍎🖊"
})
export class PPAPCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(this.defaultChatInputCommand);
    }

    public override chatInputRun(interaction: ChatInputCommandInteraction) {
        return interaction.reply({
            embeds: [
                new Embed()
                    .setColor(Colors.Yellow)
                    .setTitle(this.description)
                    .setDescription("[Pen Pineapple Apple Pen](https://www.youtube.com/watch?v=Ct6BUPvE2sM)")
                    .setImage("https://c.tenor.com/U5jXEmtm8aIAAAAC/ppap-dance.gif")
                    .setFooter({ text: "What did you expect?" })
            ],
            ephemeral: true
        });
    }
}