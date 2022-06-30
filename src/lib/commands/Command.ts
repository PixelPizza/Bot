import {
	SlashCommandBuilder,
	type SlashCommandOptionsOnlyBuilder,
	type SlashCommandSubcommandsOnlyBuilder
} from "@discordjs/builders";
import {
	type ApplicationCommandRegistry,
	type ApplicationCommandRegistryRegisterOptions,
	Command as SapphireCommand,
	PreconditionArrayResolvable
} from "@sapphire/framework";
import type { ChatInputApplicationCommandData } from "discord.js";
import type { PrismaModelManagerStoreEntries } from "../stores/PrismaModelManagerStore";

export abstract class Command extends SapphireCommand {
	public getModel<Name extends keyof PrismaModelManagerStoreEntries>(
		name: Name
	): PrismaModelManagerStoreEntries[Name] {
		return this.container.stores.get("models").get(name);
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

	public static readonly WorkerOnlyPrecondition: PreconditionArrayResolvable = ["ChefOnly", "DelivererOnly"];
}

export namespace Command {
	export type AutocompleteInteraction = SapphireCommand.AutocompleteInteraction;
	export type ChatInputInteraction = SapphireCommand.ChatInputInteraction;
	export type Context = SapphireCommand.Context;
	export type ContextMenuInteraction = SapphireCommand.ContextMenuInteraction;
	export type JSON = SapphireCommand.JSON;
	export type Options = SapphireCommand.Options;
	export type Registry = SapphireCommand.Registry;
	export type RunInTypes = SapphireCommand.RunInTypes;
}
