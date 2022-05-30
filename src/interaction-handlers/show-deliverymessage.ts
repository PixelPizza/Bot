import { codeBlock } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import { MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction, WebhookEditMessageOptions } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class DeliveryMessageInteractionHandler extends InteractionHandler {
    public override parse(interaction: SelectMenuInteraction) {
        if (interaction.customId !== "deliverymessage/show") return this.none();
        return this.some();
    }

    public override async run(interaction: SelectMenuInteraction): Promise<any> {
		const deliverer = await this.container.stores.get("models").get("user").findOrCreate(interaction.user.id);
		const currentMessage = deliverer.deliveryMessage ?? stripIndents`
            Hello {customer:tag},

            Here is your order

            id: {orderID}
            order: {order}
            server: {guild}
            channel: {channel}

            Ordered at: {orderdate:date}
            Cooked at: {cookdate:date}
            Delivered at: {deliverydate:date}

            It has been cooked by {chef:tag}
            It has been delivered by {deliverer:tag}

            I hope the order is what you wanted. If you have any complaints, please join our server and tell us.
            If you want to join our server this is the invite {invite}

            I hope you have a great day! bye!
            {image}
        `;

		const normal = interaction.values[0] === "normal";
        const replyOptions: WebhookEditMessageOptions & { embeds: MessageEmbed[]; components: MessageActionRow[] } = {
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Current Delivery Message")
					.setDescription(codeBlock(currentMessage))
			],
			components: [
				new MessageActionRow().addComponents(
					new MessageSelectMenu().setCustomId("deliverymessage/show").addOptions([
						{
							label: "Normal",
							value: "normal",
							default: true
						},
						{
							label: "Colored",
							value: "colored"
						}
					])
				)
			]
		};
        
        replyOptions.embeds[0].setDescription(
            normal
                ? codeBlock(currentMessage)
                : codeBlock("ansi", currentMessage)
                        .replace(
                            /{(image|invite|orderID|order|guild|server|channel|chef|deliverer|customer|orderdate|cookdate|deliverydate)}/g,
                            (_r, match) => `\x1b[0;34m{\x1b[0;32m${match}\x1b[0;34m}\x1b[0m`
                        )
                        .replace(
                            /{(chef|deliverer|customer)(?:: *(tag|id|username|name|ping|mention))}/g,
                            (_r, name, type) => `\x1b[0;34m{\x1b[0;32m${name}\x1b[0;36m:\x1b[0;33m${type}\x1b[0;34m}\x1b[0m`
                        )
                        .replace(
                            /{(orderdate|cookdate|deliverydate)(?:: *(date|time|datetime))}/g,
                            (_r, name, type) => `\x1b[0;34m{\x1b[0;32m${name}\x1b[0;36m:\x1b[0;33m${type}\x1b[0;34m}\x1b[0m`
                        )
        );
        (replyOptions.components[0].components[0] as MessageSelectMenu).setOptions([
            {
                label: "Normal",
                value: "normal",
                default: normal
            },
            {
                label: "Colored",
                value: "colored",
                default: !normal
            }
        ]);
        await interaction.update(replyOptions);
    }
}