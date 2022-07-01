import { Piece, PieceContext, PieceOptions } from "@sapphire/framework";
import { ThreadChannel, Webhook } from "discord.js";

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

	public get fetchMessage() {
		return this.webhook.fetchMessage.bind(this.webhook);
	}

	public get deleteMessage() {
		return this.webhook.deleteMessage.bind(this.webhook);
	}

	public get editMessage() {
		return this.webhook.editMessage.bind(this.webhook);
	}

	public get edit() {
		return this.webhook.edit.bind(this.webhook);
	}

	public get send() {
		return this.webhook.send.bind(this.webhook);
	}
}

export namespace WebhookManager {
	export type Options = WebhookManagerOptions;
}
