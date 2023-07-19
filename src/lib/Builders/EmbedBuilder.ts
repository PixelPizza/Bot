import { Colors, EmbedBuilder as DiscordEmbedBuilder } from "discord.js";

export class EmbedBuilder extends DiscordEmbedBuilder {
	public success(title?: string | null): this {
		return this.setColor(Colors.Green).setTitle(title ?? "Success");
	}

	public warning(title?: string | null): this {
		return this.setColor(Colors.Yellow).setTitle(title ?? "Warning");
	}

	public error(title?: string | null): this {
		return this.setColor(Colors.Red).setTitle(title ?? "Error");
	}

	public info(title?: string | null): this {
		return this.setColor(Colors.Blue).setTitle(title ?? "Info");
	}
}
