import { inspect } from "util";
import { LogLevel } from "@sapphire/framework";
import type { Container } from "@sapphire/pieces";
import { Logger as SapphireLogger, LoggerOptions } from "@sapphire/plugin-logger";
import { ColorResolvable, WebhookClient } from "discord.js";

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
		[LogLevel.Trace, new WebhookLogFormat("GREY", "Trace")],
		[LogLevel.Debug, new WebhookLogFormat("#ff00ff", "Debug")], // Magenta
		[LogLevel.Info, new WebhookLogFormat("#00ffff", "Info")], // Cyan
		[LogLevel.Warn, new WebhookLogFormat("YELLOW", "Warn")],
		[LogLevel.Error, new WebhookLogFormat("RED", "Error")],
		[LogLevel.Fatal, new WebhookLogFormat("DARK_RED", "Fatal")],
		[LogLevel.None, new WebhookLogFormat("DEFAULT", "")]
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
				{
					color: format!.color,
					title: format!.title,
					description: values
						.map((value) =>
							typeof value === "string" ? value : inspect(value, { colors: false, depth: this.depth })
						)
						.join(this.join),
					timestamp: Date.now()
				}
			],
			username: "PixelPizza Console",
			avatarURL: this.container.client.user!.displayAvatarURL()
		});
	}
}
