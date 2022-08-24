const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Replies with informations about the bot.')
		.setDMPermission(false),
	async execute(interaction) {
		const aboutEmbed = new EmbedBuilder()
			.setColor(0xFF0099)
			.setTitle('About MakeAStory')
			.setDescription('A discord bot for writing stories together.')
			.addFields(
				{ name: 'Gameplay', value: 'Run `/create <title> <words>` to start a story and the bot will create a thread. When all the players joined, run `/start`. Finally, after the game is done, run `/finish`!' },
				{ name: 'Contacts', value: '[GitHub](https://github.com/SzoDavid/MakeAStory)' },
			);

		await interaction.reply({ embeds: [aboutEmbed] });
	},
};
