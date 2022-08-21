const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Replies with informations about the bot.'),
	async execute(interaction) {
		console.log('Command "about" is called');

		const aboutEmbed = new EmbedBuilder()
			.setColor(0xFF0099)
			.setTitle('About MakeAStory')
			.setDescription('A discord bot for writing stories together.')
			.addFields(
				{ name: 'Contacts', value: '[GitHub](https://github.com/SzoDavid/MakeAStory)' },
			);

		await interaction.reply({ embeds: [aboutEmbed] });
	},
};
