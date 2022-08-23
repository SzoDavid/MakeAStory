const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Creates a new story.')
		.addStringOption(option =>
			option.setName('title')
				.setDescription('The title which will be the name of the thread where the story will be written.')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('words')
				.setDescription('The maximum amount of words one player can write in one round.')
				.setRequired(true)),
	async execute(interaction, client) {
		const name = interaction.options.getString('title');

		if (!interaction.channel.threads) {
			await interaction.reply({ content: 'You can\'t start a game in this channel!', ephemeral: true });
			return;
		}

		if (interaction.channel.threads.cache.find(x => x.name === name)) {
			await interaction.reply({ content: 'This name is occupied.', ephemeral: true });
			return;
		}

		const thread = await interaction.channel.threads.create({ name: name });

		thread.join();
		await thread.members.add(interaction.user.id);

		client.threads.set(thread.id, {
			owner: interaction.user.tag,
			name: name,
			words: interaction.options.getInteger('words'),
			players: [],
			started: false,
			parent: interaction.channel,
			counter: 0,
			story: '',
		});

		await interaction.reply({ content: 'The story has been started successfully! After everyone has joined, run `/start` in the thread and after the game has finished run `/finish`!', ephemeral: true });
	},
};
