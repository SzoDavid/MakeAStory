const { EmbedBuilder } = require('discord.js');

module.exports = { onEnd, onMessage };

function onEnd(client, channel) {
	const data = client.threads.get(channel.id);

	// Clean up
	client.threads.sweep(thread => thread.name === data.name);
	client.collectors.sweep(thread => thread.name === data.name);
	channel.setArchived(true);

	if (data.story.length < 1) return;

	// Create embed
	const finishEmbed = new EmbedBuilder()
		.setColor(0xFF0099)
		.setTitle(`${data.name} is ready for printing!`)
		.setDescription(data.story);

	data.parent.send({ embeds: [finishEmbed] });
}

async function onMessage(client, channel, message) {
	const data = client.threads.get(channel.id);

	// Checks
	if (!data.players.includes(message.author.id)) {
		await message.author.send('Oh shoot! You just missed the start of this game, try joining for a next round!');
		await message.delete();
		return;
	}

	if (message.author.id !== data.players[data.counter]) {
		await message.author.send('It\'s not your turn!');
		await message.delete();
		return;
	}

	const words = message.content.split(' ');
	if (words.length !== data.words) {
		await message.author.send(`You must write exactly ${data.words} words. Try again!`);
		await message.delete();
		return;
	}

	// Update data
	data.story += `${message.content} `;
	if (++data.counter === data.players.length) data.counter = 0;
	client.threads.set(channel.id, data);
}