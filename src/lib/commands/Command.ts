import {
	SlashCommandBuilder,
	type SlashCommandOptionsOnlyBuilder,
	type SlashCommandSubcommandsOnlyBuilder
} from "@discordjs/builders";
import {
	type ApplicationCommandRegistry,
	type ApplicationCommandRegistryRegisterOptions,
	Command as SapphireCommand
} from "@sapphire/framework";
import type { ChatInputApplicationCommandData } from "discord.js";

export abstract class Command extends SapphireCommand {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			preconditions: ["NotBlacklisted", ...(options.preconditions ?? [])]
		});
	}

	protected get defaultChatInputCommand() {
		return new SlashCommandBuilder().setName(this.name).setDescription(this.description);
	}

	protected registerPrivateChatInputCommand(
		registry: ApplicationCommandRegistry,
		command:
			| ChatInputApplicationCommandData
			| SlashCommandBuilder
			| SlashCommandSubcommandsOnlyBuilder
			| SlashCommandOptionsOnlyBuilder
			| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
			| ((
					builder: SlashCommandBuilder
			  ) =>
					| SlashCommandBuilder
					| SlashCommandSubcommandsOnlyBuilder
					| SlashCommandOptionsOnlyBuilder
					| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">) = this.defaultChatInputCommand,
		options?: Omit<ApplicationCommandRegistryRegisterOptions, "guildIds">
	) {
		return registry.registerChatInputCommand(command, {
			...options,
			guildIds: this.container.env.array("COMMAND_GUILDS")
		});
	}
}

export namespace Command {
	export type Context = SapphireCommand.Context;
	export interface Options extends SapphireCommand.Options {}
}
