import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, CommandOptions } from "@sapphire/framework";
import type { CommandInteraction, Message, MessageOptions, TextChannel } from "discord.js";

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
		registry.registerChatInputCommand(new SlashCommandBuilder().setName(this.name).setDescription(this.description));
	}

	public override async messageRun(message: Message) {
		return message.channel.send(await this.getReplyOptions());
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		return interaction.reply(await this.getReplyOptions());
	}
}
