import {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
} from "discord.js";
import Command from "../handlers/commands/Command";
import { MessagingService } from "cloudblox";

export default class Ping extends Command<ChatInputCommandInteraction> {
	constructor() {
		super({
			name: "game",
			description: "Commands to execute on a Roblox game",
			defaultMemberPermissions: "Administrator",
			options: [
				{
					name: "shutdown",
					description: "Shuts down the game",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "game",
							description: "The game to shut down",
							type: ApplicationCommandOptionType.String,
							required: true,
							choices: [
								{
									name: "Feature Testing and Experimentation",
									value: "feature_experimentation_game"
								}
							]
						},
					]
				},
				{
					name: "kick",
					description: "Kick a player from the game",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "game",
							description: "The game to kick the player from",
							type: ApplicationCommandOptionType.String,
							required: true,
							choices: [
								{
									name: "Feature Testing and Experimentation",
									value: "feature_experimentation_game"
								}
							],
						},
						{
							name: "player",
							description: "The username of the player to kick from the selected game",
							type: ApplicationCommandOptionType.String,
							required: true,
						},
						{
							name: "reason",
							description: "The kick reason",
							type: ApplicationCommandOptionType.String,
							required: false,
						},
					]
				},
			]
		});
	}

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand == "shutdown") {
			const game = interaction.options.getString("game");

			if (game == "feature_experimentation_game") {

				try {

					MessagingService.PublishAsync(`ShutdownServers`, "Feature Experimentation Game")
					await interaction.reply({ content: "Successfully shut down the game!" })

				} catch (e) {
					console.log(e)
					await interaction.reply({ content: "An error occured when executing this command.", ephemeral: true })
				}
			}

		} else if(subcommand === "kick"){
			const game = interaction.options.getString("game");

			if (game == "feature_experimentation_game") {
				console.log("hi")
				try {
					console.log("command executed")
					const player = interaction.options.getString("player");
					const reason = interaction.options.getString("reason") ?? "No reason provided";

					const kickData = {
						"username": player,
						"reason": reason
					}

					MessagingService.PublishAsync(`KickPlayer`, JSON.stringify(kickData))
					console.log(JSON.stringify(kickData));
					await interaction.reply({ content: "If the player was in the game, they have been successfully kicked!" });

				} catch (e) {
					console.log(e)
					await interaction.reply({ content: "An error occured when executing this command.", ephemeral: true })
				}
			}
		}
	}
}