import { codeBlock } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import type { ApplicationCommandRegistry } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { stripIndents } from "common-tags";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../lib/commands/Command";

@ApplyOptions<Command.Options>({
	description: "Show the rules for ordering",
	cooldownDelay: Time.Minute * 5
})
export class RulesCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.defaultChatInputCommand);
	}

	public override chatInputRun(interaction: CommandInteraction) {
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("BLUE")
					.setTitle("Order Rules and Guidelines")
					.setDescription(
						codeBlock(
							"markdown",
							stripIndents`
                        1. No NSFW
                        2. No items that are offensive or are related/imply any form of discrimination
                        3. No items related to child exploitation (this includes Pedophilia, Child abuse, or any other form of exploitation to minors)
                        4. No controversial or political themed items (however items with a politician's face on them are allowed)
                        5. No items which relate to extreme ideologies or violent groups such as Hitler/Nazis and communism
                        6. No illegal drugs (excluding weed)
                        7. No items that are related to death, depression, disorders, or mortal illnesses
                        8. No items which include gore/blood
                        9. No poisons or other kinds of lethal substances (excluding bleach)
                        10. No human flesh or human/animal body parts (however pictures of whole humans and animals are allowed)
                        11. No spoiler items
                        12. No orders that contain more than 5 items/requests (Base item counts as an item)
                        13. Must include a a food item (transparent & invisible items are not allowed either, also no menu numbers)
                        14. Use COMMON SENSE
                        15. Give workers time to cook and deliver orders. They also do things besides cooking and delivering
                        16. pixel Pizza must be in the guild in order to order a item
                        17. no profile pictures on items
                        18. Orders have to be in english
                        19. Your server must have easy verification (Member screening,reacting Etc) or no verification at all.
                    `
						)
					)
			],
			ephemeral: true
		});
	}
}
