const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Replies with informations about the bot.'),
	async execute(interaction) {
		const aboutEmbed = new EmbedBuilder()
			.setColor(0xFF0099)
			.setTitle('About MakeAStory')
			.setDescription('A discord bot for writing stories together.')
			.addFields(
				{ name: 'Gameplay', value: 'Run `/create <title> <words>` to start a story. The bot will create a thread. When all the players joined, run `/start`. The bot will generate the order...' },
				{ name: 'Contacts', value: '[GitHub](https://github.com/SzoDavid/MakeAStory)' },
			);

		await interaction.reply({ embeds: [aboutEmbed] });
	},
};
