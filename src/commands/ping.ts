import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Message, Embed, Colors, SnowflakeUtil, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Displays the bot ping"
})
export class PingCommand extends Command {
	private getPingEmbed(messageLatency: number) {
		return new Embed({
			color: Colors.Green,
			title: "🏓 Pong!",
			fields: [
				{
					name: "API Latency",
					value: `${Math.round(this.container.client.ws.ping)}ms`
				},
				{
					name: "Message Latency",
					value: `${messageLatency}ms`
				}
			]
		});
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	public override async messageRun(message: Message) {
		const msg = await message.channel.send("Pinging...");
		return msg.edit({
			content: null,
			embeds: [this.getPingEmbed(msg.createdTimestamp - message.createdTimestamp)]
		});
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction): Promise<any> {
		const reply = await interaction.reply({
			content: "Pinging...",
			fetchReply: true
		});
		const createdTimestamp =
			reply instanceof Message ? reply.createdTimestamp : Number(SnowflakeUtil.deconstruct(reply.id).timestamp);
		return interaction.editReply({
			content: null,
			embeds: [this.getPingEmbed(createdTimestamp - interaction.createdTimestamp)]
		});
	}
}
