import { ApplyOptions } from "@sapphire/decorators";
import { Command, CommandOptions } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import type { Message } from "discord.js";

@ApplyOptions<CommandOptions>({
	description: "Vote for the bot"
})
export class VoteCommand extends Command {
	public async messageRun(message: Message) {
		const { client } = this.container;
		await message.channel.send({
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
		});
	}
}
