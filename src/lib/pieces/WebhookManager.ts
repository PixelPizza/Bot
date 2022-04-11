import { Piece, PieceContext, PieceOptions } from "@sapphire/framework";
import type { APIMessage } from "discord-api-types";
import {
	MessagePayload,
	MessageResolvable,
	ThreadChannel,
	Webhook,
	WebhookEditData,
	WebhookEditMessageOptions,
	WebhookFetchMessageOptions,
	WebhookMessageOptions
} from "discord.js";

export interface WebhookManagerOptions extends PieceOptions {
	webhookName: string;
	webhookAvatar?: string;
	channelId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
export class WebhookManager extends Piece<WebhookManagerOptions> {
	private webhook!: Webhook;

	public constructor(context: PieceContext, options: WebhookManagerOptions) {
		super(context, options);
	}

	public get avatar() {
		return this.webhook.avatarURL();
	}

	public override onLoad() {
		this.container.client.on("ready", async (client) => {
			const channel = await this.container.client.channels.fetch(this.options.channelId);
			if (!channel?.isText() || channel.type === "DM" || channel instanceof ThreadChannel)
				throw new Error(`Invalid webhook channel for ${this.name}`);
			const webhooks = await channel.fetchWebhooks();
			this.webhook =
				webhooks.find((webhook) => webhook.owner?.id === client.user.id) ??
				(await channel.createWebhook(this.options.webhookName, {
					avatar: this.options.webhookAvatar ?? client.user.displayAvatarURL()
				}));
		});
		return super.onLoad();
	}

	public fetchMessage(message: string, options?: WebhookFetchMessageOptions) {
		return this.webhook.fetchMessage(message, options);
	}

	public deleteMessage(message: MessageResolvable | APIMessage, threadId?: string) {
		return this.webhook.deleteMessage(message, threadId);
	}

	public editMessage(message: MessageResolvable, options: string | MessagePayload | WebhookEditMessageOptions) {
		return this.webhook.editMessage(message, options);
	}

	public edit(options: WebhookEditData, reason?: string) {
		return this.webhook.edit(options, reason);
	}

	public send(options: string | MessagePayload | WebhookMessageOptions) {
		return this.webhook.send(options);
	}
}
