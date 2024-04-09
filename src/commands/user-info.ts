import {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	EmbedBuilder,
	type GuildMember,
	type User
} from "discord.js";

import Command from "../handlers/commands/Command";
import { InteractionExecuteError, ensureError } from "../utils/errors";

export default class Ping extends Command<ChatInputCommandInteraction> {
	constructor() {
		super({
			name: "user-info",
			description: "Gets the info of the provided member!",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "member",
					description: "The member to get the user info of",
					required: false,
					type: ApplicationCommandOptionType.User
				}
			]
		});
	}

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {

		try {
			const member: GuildMember = interaction.options.getMember("member") ?? interaction.member;
			const user: User = member.user;


			const embed = new EmbedBuilder()
				.setTitle(`${user.username}'s User Info`)
				.setThumbnail(user.displayAvatarURL({ size: 4096 }))
				.addFields(
					{
						name: `User Display Name`,
						value: `${user.displayName}`,
						inline: true
					},
					{
						name: `Server Nickname`,
						value: `${member.nickname ?? user.displayName}`,
						inline: true
					},
					{
						name: `User ID`,
						value: `${user.id}`
					},
					{
						name: `Is Bot`,
						value: `${user.bot}`
					},
					{
						name: `Joined Discord On`,
						value: `${user.createdAt.toLocaleDateString()}`,
						inline: true
					},
					{
						name: `Joined Server On`,
						value: `${member.joinedAt?.toLocaleDateString()}`,
						inline: true
					},
					{
						name: `Badges`,
						value: `\`\`\`${user.flags?.toArray()?.join(", ") ?? "None"}\`\`\``
					},
					{
						name: `Server Roles`,
						value: `\`\`\`${memberRoles(member).join(", ") ?? "None"}\`\`\``
					},
					{
						name: `Presence`,
						value: `${member.presence?.status ?? "Could not fetch status"}`,
						inline: true
					}
				)

			console.log(memberRoles(member))
			await interaction.reply({ embeds: [embed] });
		} catch (e) {
			await interaction.reply({ content: "An error occured while executing this command.", ephemeral: true });
			
		}
	}
}


const memberRoles = (member: GuildMember): string[] => {
	return member.roles.cache.map(role => role.name)
}