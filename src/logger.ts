import { inspect } from "util";
import { LogLevel } from "@sapphire/framework";
import type { Container } from "@sapphire/pieces";
import { Logger as SapphireLogger, LoggerOptions } from "@sapphire/plugin-logger";
import { ColorResolvable, Colors, EmbedBuilder, WebhookClient } from "discord.js";

export class WebhookLogFormat {
	public readonly color: ColorResolvable;
	public readonly title: string;

	public constructor(color: ColorResolvable, title: string) {
		this.color = color;
		this.title = title;
	}
}

export class Logger extends SapphireLogger {
	private readonly webhook: WebhookClient;
	private readonly webhookFormats = new Map<LogLevel, WebhookLogFormat>([
		[LogLevel.Trace, new WebhookLogFormat(Colors.Grey, "Trace")],
		[LogLevel.Debug, new WebhookLogFormat("#ff00ff", "Debug")], // Magenta
		[LogLevel.Info, new WebhookLogFormat("#00ffff", "Info")], // Cyan
		[LogLevel.Warn, new WebhookLogFormat(Colors.Yellow, "Warn")],
		[LogLevel.Error, new WebhookLogFormat(Colors.Red, "Error")],
		[LogLevel.Fatal, new WebhookLogFormat(Colors.DarkRed, "Fatal")],
		[LogLevel.None, new WebhookLogFormat(Colors.Default, "")]
	]);

	public constructor(public readonly container: Container, options?: LoggerOptions) {
		super(options);
		this.webhook = new WebhookClient({ url: this.container.env.string("CONSOLE_URL") });
	}

	public override write(level: LogLevel, ...values: readonly unknown[]): void {
		if (level < this.level) return;

		super.write(level, ...values);

		const format = this.webhookFormats.get(level) ?? this.webhookFormats.get(LogLevel.None);

		void this.webhook.send({
			embeds: [
				new EmbedBuilder()
					.setColor(format!.color)
					.setTitle(format!.title)
					.setDescription(values
						.map((value) =>
							typeof value === "string" ? value : inspect(value, { colors: false, depth: this.depth })
						)
						.join(this.join))
						.setTimestamp()
			],
			username: "PixelPizza Console",
			avatarURL: this.container.client.user!.displayAvatarURL()
		});
	}
}
