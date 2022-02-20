import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Message, Embed, Colors, MessageOptions, OAuth2Scopes, PermissionFlagsBits, ChatInputCommandInteraction, InteractionReplyOptions } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Invite the bot to your server"
})
export class InviteCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	private get replyOptions(): MessageOptions & InteractionReplyOptions {
		return {
			embeds: [
				new Embed()
					.setColor(Colors.Blue)
					.setTitle("Invite")
					.setDescription(`Here is the [Pixel Pizza invite link](${this.container.client.generateInvite({
						scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
						permissions: [PermissionFlagsBits.CreateInstantInvite, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.SendMessages, PermissionFlagsBits.UseExternalEmojis]
					})})`)
			]
		};
	}

	public override messageRun(message: Message) {
		return message.channel.send(this.replyOptions);
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction): Promise<any> {
		return interaction.reply(this.replyOptions);
	}
}
