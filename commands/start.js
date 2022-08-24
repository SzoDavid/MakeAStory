require('dotenv').config();

const GameLogic = require('../gamelogic');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start the story')
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

		if (data.started === true) {
			await interaction.reply({ content: 'The game is already on!', ephemeral: true });
			return;
		}

		// Create Order
		let order = '';

		await channel.members.fetch().then((members) => {
			[...members.keys()].forEach(member => {
				if (member !== process.env.CLIENT_ID) {
					data.players.push(member);
					order += `<@${member}>\n`;
				}
			});
		});

		// Create embed
		const startEmbed = new EmbedBuilder()
			.setColor(0xFF0099)
			.setTitle(`Ready, set, ${data.name}!`)
			.setDescription(`The game has started. When it's your turn, write **${data.words}** words to form a story. Messages starting with \`${process.env.IGNORE_PREFIX}\` will be ignored. Have fun!`)
			.addFields(
				{ name: 'Order:', value: order },
			);

		// Collector
		const filter = m => !(m.author.bot || m.content.startsWith(process.env.IGNORE_PREFIX));

		client.collectors.set(channel.id, channel.createMessageCollector({ filter }));

		const collector = client.collectors.get(channel.id);

		collector.on('collect', m => {
			GameLogic.onMessage(client, channel, m);
		});

		collector.on('end', collected => {
			GameLogic.onEnd(client, channel, collected);
		});

		// Update values
		data.started = true;
		client.threads.set(channel.id, data);

		await interaction.reply({ embeds: [startEmbed] });
	},
};
