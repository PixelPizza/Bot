import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import type { CommandInteraction, Message, MessageOptions } from "discord.js";
import { Command } from "../Command";

@ApplyOptions<CommandOptions>({
	description: "Vote for the bot"
})
export class VoteCommand extends Command {
	private get replyOptions(): MessageOptions {
		const { client } = this.container;
		return {
			embeds: [
				{
					color: "BLUE",
					title: "Vote links",
					description: stripIndents`
						[top.gg](https://top.gg/bot/${client.user?.id}/vote)
						[discordbotlist.com](https://discordbotlist.com/bots/pixel-pizza/upvote)
					`,
					fields: [
						{
							name: "Rewards",
							value: stripIndents`
								**Note:** rewards only apply to top.gg
								${client.emojis.cache.get(process.env.ECO_EMOJI)} 200
								500 Exp
							`
						}
					]
				}
			]
		};
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	public override messageRun(message: Message) {
		return message.channel.send(this.replyOptions);
	}

	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(this.replyOptions);
	}
}
