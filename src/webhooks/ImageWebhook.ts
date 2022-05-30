import { ApplyOptions } from "@sapphire/decorators";
import type { Message, MessageAttachment } from "discord.js";
import { WebhookManager, WebhookManagerOptions } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManagerOptions>(({ container }) => ({
	name: "image",
	channelId: container.env.string("IMAGE_CHANNEL"),
	webhookName: "Pixel Pizza Images"
}))
export class ImageWebhook extends WebhookManager {
	public sendImage(image: MessageAttachment) {
		return this.send({
			files: [image]
		}) as Promise<Message>;
	}
}
