require('dotenv').config();

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
			.setDescription(`The game has started. When it's your turn, write **${data.words}** words to form a story. Have fun!`)
			.addFields(
				{ name: 'Order:', value: order },
			);

		// Collector

		const filter = () => true;

		client.collectors.set(`collector${channel.id}`, channel.createMessageCollector({ filter, time: 30000, max: 10000 }));

		console.log(channel.name);

		const collector = client.collectors.get(`collector${channel.id}`);

		collector.on('collect', m => {
			console.log(`Collected ${m.content} from ${m.author.username}`);
		});

		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
		});

		// Update values
		data.started = true;
		client.threads.set(channel.id, data);

		await interaction.reply({ embeds: [startEmbed] });
	},
};
