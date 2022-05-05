import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry, CommandOptions } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<CommandOptions>({
	description: "blacklist",
	preconditions: ["NotManager"]
})
export class BlacklistCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry): void {
		this.registerPrivateChatInputCommand(
			registry,
			new SlashCommandBuilder()
				.setName(this.name)
				.setDescription(this.description)
				.addSubcommand((input) =>
					input
						.setName("add")
						.setDescription("Add a user to the blacklist")
						.addUserOption((input) => input.setName("user").setDescription("the user to blacklist").setRequired(true))
						.addStringOption((input) =>
							input.setName("reason").setDescription("reason why for being blacklisted").setRequired(true)
						)
				)
				.addSubcommand((input) =>
					input
						.setName("remove")
						.setDescription("Remove a user from the blacklist")
						.addUserOption((input) => input.setName("user").setDescription("the user to unblacklist").setRequired(true))
				),
			{
				idHints: ["971835473569927200", "971835475188916294"]
			}
		);
	}

	public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
		await interaction.deferReply();

		switch (interaction.options.getSubcommand(true)) {
			case "add":
				return this.chatInputAdd(interaction);
			case "remove":
				return this.chatInputRemove(interaction);
		}
	}

	public async chatInputAdd(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user", true);
		const reason = interaction.options.getString("reason", true);

		if (await this.container.prisma.blacklist.findUnique({ where: { user: user.id } })) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setTitle("User already blacklisted")
						.setDescription(`${user.toString()} is already blacklisted.`)
				]
			});
		}

		await this.container.prisma.blacklist.create({
			data: {
				user: user.id,
				reason,
				author: interaction.user.id
			}
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("GREEN")
					.setTitle("User blacklisted")
					.setDescription(`${user.toString()} has been blacklisted.`)
			]
		});
	}

	public async chatInputRemove(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user", true);

		if (!(await this.container.prisma.blacklist.findUnique({ where: { user: user.id } }))) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setTitle("User not blacklisted")
						.setDescription(`${user.toString()} is not blacklisted.`)
				]
			});
		}

		await this.container.prisma.blacklist.delete({
			where: {
				user: user.id
			}
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor("GREEN")
					.setTitle("User unblacklisted")
					.setDescription(`${user.toString()} has been unblacklisted.`)
			]
		});
	}
}
