import { ApplyOptions } from "@sapphire/decorators";
import { Command, CommandOptions } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<CommandOptions>({
	description: "Invite the bot to your server"
})
export class InviteCommand extends Command {
	public async messageRun(message: Message) {
		await message.channel.send({
			embeds: [
				{
					color: "BLUE",
					title: "Invite",
					description: `Here is the [Pixel Pizza invite link](${this.container.client.generateInvite({
						scopes: ["applications.commands", "bot"],
						permissions: ["CREATE_INSTANT_INVITE", "EMBED_LINKS", "SEND_MESSAGES"]
					})})`
				}
			]
		});
	}
}
