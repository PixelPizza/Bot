import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";

@ApplyOptions<CommandOptions>({
	description: "Displays the bot ping",
	flags: ["api", "message", "m"]
})
export class PingCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		const msg = await message.channel.send("Pinging...");

		const apiLatency = Math.round(this.container.client.ws.ping);
		const messageLatency = msg.createdTimestamp - message.createdTimestamp;

		const embed = new MessageEmbed({
			color: "GREEN",
			title: "🏓 Pong!"
		});
		if (!args.getFlags("api", "message", "m")) {
			embed.setFields([
				{
					name: "API Latency",
					value: `${apiLatency}ms`
				},
				{
					name: "Message Latency",
					value: `${messageLatency}ms`
				}
			]);
		} else if (args.getFlags("api")) {
			embed.setDescription(`${apiLatency}ms`);
		} else {
			embed.setDescription(`${messageLatency}ms`);
		}

		return msg.edit({
			content: null,
			embeds: [embed]
		});
	}
}
