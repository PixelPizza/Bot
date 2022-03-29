import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import { CommandInteraction, Message, MessageEmbed, MessageOptions } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Vote for the bot"
})
export class VoteCommand extends Command {
	private get replyOptions(): MessageOptions {
		const { client } = this.container;
		return {
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Vote links")
					.setDescription(stripIndents`
						[top.gg](https://top.gg/bot/${client.user?.id}/vote)
						[discordbotlist.com](https://discordbotlist.com/bots/pixel-pizza/upvote)
					`)
					.addField("Rewards", stripIndents`
						**Note:** rewards only apply to top.gg
						${client.emojis.cache.get(this.container.env.string("ECO_EMOJI"))} 200
						500 Exp
					`)
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
