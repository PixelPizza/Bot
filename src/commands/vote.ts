import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import { Message, Colors, MessageOptions, ChatInputCommandInteraction, InteractionReplyOptions, EmbedBuilder } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Vote for the bot"
})
export class VoteCommand extends Command {
	private get replyOptions(): MessageOptions & InteractionReplyOptions {
		const { client } = this.container;
		return {
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Blue)
					.setTitle("Vote links")
					.setDescription(stripIndents`
						[top.gg](https://top.gg/bot/${client.user?.id}/vote)
						[discordbotlist.com](https://discordbotlist.com/bots/pixel-pizza/upvote)
					`)
					.addFields({ name: "Rewards", value: stripIndents`
						**Note:** rewards only apply to top.gg
						${client.emojis.cache.get(process.env.ECO_EMOJI)} 200
						500 Exp
					` })
			]
		};
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	public override messageRun(message: Message) {
		return message.channel.send(this.replyOptions);
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction): Promise<any> {
		return interaction.reply(this.replyOptions);
	}
}
