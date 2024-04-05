module.exports = {
	config: {
		name: "uptime",
		aliases: ["up"],
      author: "yukinori",
		role: 0,
		shortDescription: {
			en: "Show server uptime",
		},
		longDescription: {
			en: "Shows the duration for which the server has been running",
		},
		category: "goatBot",
		guide: {
			en: "{p}uptime",
		},
	},

	onStart: async function ({ api, message, threadsData }) {
		const os = require("os");
		const uptime = os.uptime();

       const days = Math.floor(uptime / (60 * 60 * 24));
       const hours = Math.floor((uptime / (60 * 60)) % 24);
       const mins = Math.floor((uptime / 60) % 60);
       const seconds = Math.floor(uptime % 60);

		const system = `OS: ${os.platform()} ${os.release()}`;
		const cores = `Cores: ${os.cpus().length}`;
		const arch = `Architecture: ${os.arch()}`;
		const totalMemory = `Total Memory: ${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`;
		const freeMemory = `Free Memory: ${Math.round(os.freemem() / (1024 * 1024 * 1024))} GB`;
		const uptimeString = `Uptime: ${days} days, ${hours} hours, ${mins} minutes, and ${seconds} seconds`;

		const response = `🕒 ${uptimeString}\n📡 ${system}\n🛡 ${cores}\n⚔ No AI Status\n📈 Total Users: ${threadsData.size}\n📉 Total Threads: ${threadsData.size}\n⚖ AI Usage: 0.0\n📊 RAM Usage: ${Math.round(process.memoryUsage().rss / (1024 * 1024))} MB\n💰 Total(RAM): ${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB\n💸 Current(RAM): ${Math.round(os.freemem() / (1024 * 1024 * 1024))} GB\n🛫 Ping: 15 ms\n🕰 Uptime(Seconds): ${Math.floor(process.uptime())}`;

		message.reply(response);
	},
};