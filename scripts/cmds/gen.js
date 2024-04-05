const axios = require("axios");

 module.exports = {
  config: {
    name: "generate",
aliases: ['gen'],
    version: "1.1",
    author: "Yukinori",
    countDown: 15,
    role: 0,
    shortDescription: {
      en: 'Text to Image'
    },
    longDescription: {
      en: "Text to image"
    },
    category: "image",
    guide: {
      en: '{pn} your prompt'
    }
  },
  onStart: async function ({ message, api, args, event }) {
    const text = args.join(' ');

    if (!text) {
      return message.reply("Please provide a prompt");
    }

    const [prompt, model] = text.split('|').map((text) => text.trim());
    const puti = model || "19";
    const baseURL = `https://sandipapi.onrender.com/gen?prompt=${prompt}&model=${puti}`;

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    message.reply("✅| Generating please wait.", async (err, info) => {
      message.reply({
        attachment: await global.utils.getStreamFromURL(baseURL)
      });
      let ui = info.messageID;
      message.unsend(ui);
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    });
  }
};