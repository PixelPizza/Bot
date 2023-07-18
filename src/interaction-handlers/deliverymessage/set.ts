import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { Colors, EmbedBuilder, ModalSubmitInteraction } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class DeliveryMessageInteractionHandler extends InteractionHandler {
	private get customerRegex() {
		return this.makeUserRegex("customer");
	}

	private get chefRegex() {
		return this.makeUserRegex("chef");
	}

	private readonly requirements: (
		| {
				regex: string;
				name: string;
		  }
		| string
	)[] = [
		{
			regex: `{${this.chefRegex}}`,
			name: "{chef}"
		},
		{
			regex: `{${this.customerRegex}}`,
			name: "{customer}"
		},
		`{image}`,
		`{invite}`
	];

	public override parse(interaction: ModalSubmitInteraction) {
		if (interaction.customId !== "deliverymessage/set") return this.none();
		return this.some();
	}

	public override async run(interaction: ModalSubmitInteraction): Promise<any> {
		await interaction.deferReply({ ephemeral: true });

		const message = interaction.fields.getTextInputValue("message");
		const deliverer = await this.container.stores.get("models").get("user").findOrCreate(interaction.user.id);

		const missing: string[] = [];
		this.requirements.forEach((requirement) => {
			const isString = typeof requirement === "string";
			if (!(message.match(new RegExp(isString ? requirement : requirement.regex, "g")) || []).length)
				missing.push(isString ? requirement : requirement.name);
		});

		if (missing.length) {
			throw new Error(`Your delivery message is missing the following: ${missing.join(", ")}`);
		}

		await this.container.stores
			.get("models")
			.get("user")
			.update({
				where: { id: deliverer?.id },
				data: {
					deliveryMessage: message.replaceAll("\\n", "\n")
				}
			});

		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Green)
					.setTitle("Delivery Message Set")
					.setDescription("Your delivery message has been set")
			]
		});
	}

	private makeUserRegex(name: string): string {
		return `${name}(?:: *(tag|id|username|name|ping|mention))?`;
	}
}
