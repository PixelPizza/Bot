import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { CommandInteraction, Message, Embed, Colors, MessageOptions, TextChannel, InteractionReplyOptions } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Get the invite link to the support server"
})
export class SupportCommand extends Command {
	private async getReplyOptions(): Promise<MessageOptions & InteractionReplyOptions> {
		const channel = (await this.container.client.channels.fetch(process.env.INVITE_CHANNEL)) as TextChannel;
		return {
			embeds: [
				new Embed()
					.setColor(Colors.Blue)
					.setTitle("Support Server")
					.setDescription(`Here is the [support server invite link](${(await channel.createInvite({ maxAge: 0 })).url})`)
			]
		};
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	public override async messageRun(message: Message) {
		return message.channel.send(await this.getReplyOptions());
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		return interaction.reply(await this.getReplyOptions());
	}
}
