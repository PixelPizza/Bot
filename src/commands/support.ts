import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import type { CommandInteraction, Message, MessageOptions, TextChannel } from "discord.js";
import { Command } from "../lib/Command";

@ApplyOptions<CommandOptions>({
	description: "Get the invite link to the support server"
})
export class SupportCommand extends Command {
	private async getReplyOptions(): Promise<MessageOptions> {
		const channel = (await this.container.client.channels.fetch(process.env.INVITE_CHANNEL)) as TextChannel;
		return {
			embeds: [
				{
					color: "BLUE",
					title: "Support Server",
					description: `Here is the [support server invite link](${(await channel.createInvite({ maxAge: 0 })).url})`
				}
			]
		};
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	public override async messageRun(message: Message) {
		return message.channel.send(await this.getReplyOptions());
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(await this.getReplyOptions());
	}
}
