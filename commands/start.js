const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start the story'),
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

		if (data.started === true) {
			await interaction.reply({ content: 'The game is already on!', ephemeral: true });
			return;
		}

		// Create Order
		let order = '';

		data.started = true;
		await data.thread.members.fetch().then((members) => {
			[...members.keys()].forEach(member => {
				if (member !== process.env.CLIENT_ID) {
					data.players.push(member);
					order += `<@${member}>\n`;
				}
			});
		});

		client.threads.set(channel.id, data);

		await interaction.reply(`Ready, set, go!\n${order}`);
	},
};
