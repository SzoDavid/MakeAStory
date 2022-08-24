const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('finish')
		.setDescription('Finish the story')
		.setDMPermission(false),
	async execute(interaction, client) {
		// Tests
		const channel = interaction.channel;

		if (!client.threads.get(channel.id)) {
			await interaction.reply({ content: 'This command can only be ran in threads started with the command `/create`!', ephemeral: true });
			return;
		}

		const data = client.threads.get(channel.id);

		if (interaction.user.tag !== data.owner) {
			await interaction.reply({ content: 'Only the story\'s creator can run this command!', ephemeral: true });
			return;
		}

		if (data.started === false) {
			await interaction.reply({ content: 'The game has not even started yet...', ephemeral: true });
			return;
		}

		await interaction.reply('Story ended successfully!');

		await client.collectors.get(channel.id).stop();
	},
};
