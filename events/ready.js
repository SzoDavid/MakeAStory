module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`[${new Date(Date.now()).toISOString()}] Ready! Logged in as ${client.user.tag}`);
	},
};