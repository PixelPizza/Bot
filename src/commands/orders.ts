import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command, CommandOptions } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";

@ApplyOptions<CommandOptions>({
	description: "Show the current orders"
})
export class OrdersCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(new SlashCommandBuilder().setName(this.name).setDescription(this.description), {
			guildIds: [process.env.COMMAND_GUILDS].flat()
		});
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const orders = await this.container.stores.get("models").get("order").findAll();

		await interaction.editReply({
			embeds: [
				new MessageEmbed({
					color: "BLUE",
					title: "Orders",
					description: orders.map((order) => `\`${order.getDataValue("id")}\``).join(",") || "No orders"
				})
			]
		});
	}
}
