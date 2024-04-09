import {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	Colors
} from "discord.js";
import axios, { AxiosRequestConfig } from "axios";

import Command from "../handlers/commands/Command";
import { InteractionExecuteError, ensureError } from "../utils/errors";


export default class Ping extends Command<ChatInputCommandInteraction> {
	constructor() {
		super({
			name: "repo",
			description: "Gets the details of a GitHub repostory!",
			options: [
				{
					name: "username",
					description: "The GitHub username of who owns the repository",
					required: true,
					type: ApplicationCommandOptionType.String
				},
				{
					name: "repo",
					description: "The name of the repository",
					required: true,
					type: ApplicationCommandOptionType.String
				}
			],
		});
	}

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const ownerName = interaction.options.getString("username");
		const repositoryName = interaction.options.getString("repo");

		try {
			const config: AxiosRequestConfig = {
				method: 'get',
				url: `https://api.github.com/repos/${ownerName}/${repositoryName}`
			};

			axios(config)
				.then(response => {
					const data = response.data;

					const creationDate = new Date(data.created_at)
					const updateDate = new Date(data.updated_at)
					const fullName = data.full_name;
					const description = data.description;
					const avatarUrl = data.owner.avatar_url;

					const row = new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setLabel('Repository Link')
								.setStyle(ButtonStyle.Link)
								.setURL(data.html_url)
						);

					const embed = new EmbedBuilder()
						.setColor(Colors.Blurple)
						.setTitle(`${fullName} Repository Details`)
						.setThumbnail(avatarUrl)
						.setDescription(`**Description:** ${description ?? "N/A"}`)
						.setFields(
							{
								name: "Owner",
								value: `${data.owner.login}`
							},
							{
								name: "Main Language Used",
								value: `${data.language ?? "Not Available"}`
							},
							{
								name: "Is Template",
								value: `${data.is_template ?? false}`
							},
							{
								name: "Is Fork",
								value: `${data.is_fork ?? false}`
							},
							{
								name: "Is Archived",
								value: `${data.archived ?? false}`
							},
							{
								name: "Fork Count",
								value: `${data.forks_count}`,
								inline: true
							},
							{
								name: "Star Count",
								value: `${data.stargazers_count}`,
								inline: true
							},
							{
								name: "Watcher Count",
								value: `${data.watchers_count}`,
								inline: true
							},
							{
								name: "Subscribers Count",
								value: `${data.subscribers_count}`,
								inline: true
							},
							{
								name: "Open Issues Count",
								value: `${data.open_issues_count}`,
								inline: true
							},
							{
								name: "Default Branch",
								value: `${data.default_branch ?? "Not Available"}`
							},
							{
								name: "License Name",
								value: `${data.license.name ?? "No License"}`
							},
							{
								name: "Created At",
								value: `${creationDate.toLocaleDateString()}`,
								inline: true
							},
							{
								name: "Last Updated At",
								value: `${updateDate.toLocaleDateString()}`,
								inline: true
							},
						)

					interaction.reply({ embeds: [embed], components: [row] });
				})
				.catch(e => {
					interaction.reply({ content: "An error occured while fetching the repository details. Please ensure you have typed the correct username and correct repository name.", ephemeral: true });
					const cause = ensureError(e);
					throw new InteractionExecuteError(interaction, cause);
				})
		} catch (_error) {
			await interaction.reply({ content: "An error occured while fetching the repository details. Please ensure you have typed the correct username and correct repository name.", ephemeral: true });
		}
	}
}