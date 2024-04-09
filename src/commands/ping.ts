import {
	ChatInputCommandInteraction,
} from "discord.js";
import Command from "../handlers/commands/Command";

export default class Ping extends Command<ChatInputCommandInteraction> {
	constructor() {
		super({
			name: "ping",
			description: "Pong!",
			defaultMemberPermissions: "SendMessages",
		});
	}

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const pingMsg = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply(`Latency: ${pingMsg.createdTimestamp - interaction.createdTimestamp}ms`);
	}
}