const axios = require('axios');
const Data = {};

module.exports = {
  config: {
    name: "gpt",
    version: 2.0,
    author: "OtinXSandip",
    longDescription: "gpt with draw",
    category: "ai",
    guide: {
      en: "{p}{n} questions",
    },
  },
  onStart: async function ({ args, message, event, Reply, api }) {
    try {
      const prompt = args.join(' ');
if (!prompt) {
return 
message.reply("please provide questions");
}
      const chat = event.senderID;

      if (prompt.toLowerCase() === "clear") {
        delete Data[chat];
        message.reply('Done ✅');
        return;
      }

      if (!Data[chat]) {
        Data[chat] = prompt;
      } else {
        Data[chat] += '\n' + prompt;
      }

      const ass = "otinxsandeep";
      const encodedPrompt = encodeURIComponent(Data[chat]);

      if (prompt.includes("draw")) {
        const [promptText, model] = args.join(' ').split('|').map((text) => text.trim());
        const puti = model || "2";
        const baseURL = `https://sdxl.${ass}.repl.co/sdxl?prompt=${promptText}&model=${puti}`;

        message.reply({
          attachment: await global.utils.getStreamFromURL(baseURL)
        });
      } else {
        const response = await axios.get(`https://sdxl.${ass}.repl.co/gpt?prompt=${encodedPrompt}`);
        const answer = response.data.answer;

        message.reply({
          body: `${answer}

you can reply for continue chatting🫥`,
        }, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID
          });
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
  onReply: async function ({ args, message, event, Reply, api }) {
    try {
      const prompt = args.join(' ');
      const chat = event.senderID;

      if (prompt.toLowerCase() === "clear") {
        delete Data[chat];
        message.reply('Done ✅');
        return;
      }

      if (!Data[chat]) {
        Data[chat] = prompt;
      } else {
        Data[chat] += '\n' + prompt;
      }

      const ass = "otinxsandeep";
      const encodedPrompt = encodeURIComponent(Data[chat]);

      if (prompt.includes("draw")) {
        const [promptText, model] = args.join(' ').split('|').map((text) => text.trim());
        const puti = model || "2";
        const baseURL = `https://sdxl.${ass}.repl.co/sdxl?prompt=${promptText}&model=${puti}`;

        message.reply({
          attachment: await global.utils.getStreamFromURL(baseURL)
        });
      } else {
        const response = await axios.get(`https://sdxl.${ass}.repl.co/gpt?prompt=${encodedPrompt}`);
        const answer = response.data.answer;

        message.reply({
          body: `${answer}

you can reply for continue chatting 🫥`,
        }, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID
          });
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};