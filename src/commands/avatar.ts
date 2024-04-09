import {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	EmbedBuilder,
	type User
} from "discord.js";
import Command from "../handlers/commands/Command";

export default class Ping extends Command<ChatInputCommandInteraction> {
		constructor() {
				super({
						name: "avatar",
						description: "Gets the avatar of the provided user!",
						type: ApplicationCommandType.ChatInput,
						options: [
							{
								name: "user",
								description: "The user to get the avatar of",
								required: false,
								type: ApplicationCommandOptionType.User
							}
						]
				});
		}

		async execute(interaction: ChatInputCommandInteraction): Promise<void> {
			const user: User  = interaction.options.getUser("user") ?? interaction.user;

			

			const embed = new EmbedBuilder();
			embed.setTitle(`${user.username}'s avatar`)
			embed.setImage(user.displayAvatarURL({ size: 4096 }))

			await interaction.reply({ embeds: [embed] });
		}
}