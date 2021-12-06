import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, CommandOptions } from "@sapphire/framework";
import { CommandInteraction, Message, MessageEmbed, SnowflakeUtil } from "discord.js";

@ApplyOptions<CommandOptions>({
	description: "Displays the bot ping"
})
export class PingCommand extends Command {
	private getPingEmbed(messageLatency: number) {
		return new MessageEmbed({
			color: "GREEN",
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
		registry.registerChatInputCommand(new SlashCommandBuilder().setName(this.name).setDescription(this.description));
	}

	public override async messageRun(message: Message) {
		const msg = await message.channel.send("Pinging...");
		return msg.edit({
			content: null,
			embeds: [this.getPingEmbed(msg.createdTimestamp - message.createdTimestamp)]
		});
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		const reply = await interaction.reply({
			content: "Pinging...",
			fetchReply: true
		});
		const createdTimestamp =
			reply instanceof Message ? reply.createdTimestamp : SnowflakeUtil.deconstruct(reply.id).timestamp;
		return interaction.editReply({
			content: null,
			embeds: [this.getPingEmbed(createdTimestamp - interaction.createdTimestamp)]
		});
	}
}
