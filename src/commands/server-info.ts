import {
	ChatInputCommandInteraction,
	ApplicationCommandType,
	EmbedBuilder,
	type Guild
} from "discord.js";

import Command from "../handlers/commands/Command";


export default class Ping extends Command<ChatInputCommandInteraction> {
		constructor() {
				super({
						name: "server-info",
						description: "Gets the info of the server!",
						type: ApplicationCommandType.ChatInput,
						dmPermission: false
				});
		}
		async execute(interaction: ChatInputCommandInteraction): Promise<void> {
			const guild: Guild | null = interaction.client.guilds.cache.get(`${interaction.guildId}`) ?? interaction.guild;

			if(guild?.available){
					const embed = new EmbedBuilder()
					.setTitle(`${guild.name}`)
					.setDescription(`${guild.description ?? "No Description"}`)
					.setThumbnail(guild.iconURL({ size: 4096 }))
					.addFields(
						{
							name: `Guild ID`,
							value: `${interaction.guildId}`
						},
						{
							name: "Total Members Online",
							value: `${totalOnline ?? "Could not fetch the number of online members"}`,
							inline: true
						},
						{
							name: "Total Members",
							value: `${guild.memberCount}`,
							inline: true
						},
						{
							name: "Is Verified",
							value: `${guild.verified}`
						},
						{
							name: "Is Partnered",
							value: `${guild.partnered}`
						}
					)
					await interaction.reply({ embeds: [embed] });
			}
		}
}

 const totalOnline = (guild: Guild) =>  guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
	Promise.resolve(fetchedMembers.filter(member => member.presence?.status === 'online').size);
}).catch(e => {
	 Promise.reject(e);
})