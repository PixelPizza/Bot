import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import type { CommandInteraction, Message, MessageOptions } from "discord.js";
import { Command } from "../lib/Command";

@ApplyOptions<CommandOptions>({
	description: "Invite the bot to your server"
})
export class InviteCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	private get replyOptions(): MessageOptions {
		return {
			embeds: [
				{
					color: "BLUE",
					title: "Invite",
					description: `Here is the [Pixel Pizza invite link](${this.container.client.generateInvite({
						scopes: ["applications.commands", "bot"],
						permissions: ["CREATE_INSTANT_INVITE", "EMBED_LINKS", "SEND_MESSAGES", "USE_EXTERNAL_EMOJIS"]
					})})`
				}
			]
		};
	}

	public override messageRun(message: Message) {
		return message.channel.send(this.replyOptions);
	}

	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(this.replyOptions);
	}
}
