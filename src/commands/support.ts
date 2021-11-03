import { ApplyOptions } from "@sapphire/decorators";
import { Command, CommandOptions } from "@sapphire/framework";
import type { Message, TextChannel } from "discord.js";

@ApplyOptions<CommandOptions>({
	description: "Get the invite link to the support server"
})
export class SupportCommand extends Command {
	public async messageRun(message: Message) {
		const channel = (await this.container.client.channels.fetch(process.env.INVITE_CHANNEL)) as TextChannel;
		await message.channel.send({
			embeds: [
				{
					color: "BLUE",
					title: "Support Server",
					description: `Here is the [support server invite link](${(await channel.createInvite({ maxAge: 0 })).url})`
				}
			]
		});
	}
}
