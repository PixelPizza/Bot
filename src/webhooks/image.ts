import { ApplyOptions } from "@sapphire/decorators";
import type { Message, AttachmentBuilder } from "discord.js";
import { WebhookManager } from "../lib/pieces/WebhookManager";

@ApplyOptions<WebhookManager.Options>(({ container }) => ({
	channelId: container.env.string("IMAGE_CHANNEL"),
	webhookName: "Pixel Pizza Images"
}))
export class ImageWebhook extends WebhookManager {
	public sendImage(image: AttachmentBuilder) {
		return this.send({
			files: [image]
		}) as Promise<Message>;
	}
}
