import {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} from "discord.js";
import Command from "../handlers/commands/Command";
import { Thumbnails, Users } from "cloudblox";

export default class Ping extends Command<ChatInputCommandInteraction> {
	constructor() {
		super({
			name: "roblox",
			description: "List of Roblox Commands",
			options: [
				{
					name: "avatar",
					description: "Gets the avatar of the provided user!",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "username",
							description: "The username of the user to get the avatar of",
							type: ApplicationCommandOptionType.String,
							required: true
						}
					]
				}
			]
		});
	}

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const subcommand = interaction.options.getSubcommand();

		if(subcommand == "avatar"){
			const username = interaction.options.getString("username");

			try {
				await Users.getIdFromUsername(username).then(id => {
					Thumbnails.getAvatarBodyshot(id, "420x420", "png", false).then(url => {
						const embed = new EmbedBuilder()
						.setTitle(`${username}'s avatar`)
						.setImage(url)
						.setTimestamp()

						interaction.reply({ embeds: [embed] });
					}).catch(e => {
						console.log(e)
						interaction.reply({ content: "An error occured while fetching the avatar", ephemeral: true });
					})
				}).catch(e => {
					console.log(e)
					interaction.reply({ content: "An error occured while fetching the avatar", ephemeral: true });
				})


			} catch (e) {
				console.log(e)
				await interaction.reply({content: "An error occured! Ensure that you are typing a valid username."})
			}
			
		}
	}
}