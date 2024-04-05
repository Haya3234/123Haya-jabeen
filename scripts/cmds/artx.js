const axios = require('axios');

module.exports = {
  config: {
    name: "artx",
    aliases: ["Artx"],
    version: "1.0",
    author: "Samir Œ",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate art from an image URL with optional filter"
    },
    longDescription: {
      en: "Generate art from an image URL with an optional filter and send the result."
    },
    category: "𝗔𝗜-𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗",
    guide: {
      en: `[
  "0: anime2D",
  "1: book",
  "2: comic",
  "3: goth",
  "4: anime",
  "5: realistic",
  "6: horror",
  "7: superhero",
  "8: watercolor",
  "9: starry girl",
  "10: maid_",
  "11: vintage",
  "12: cartoon",
  "13: egypt",
  "14: doodle",
  "15: pirate",
  "16: dead",
  "17: pretty",
  "18: pixelart",
  "19: dark",
  "20: school",
  "21: ronin",
  "22: christmas",
  "23: biohazard",
  "24: random",
  "25: bizarre",
  "26: santa",
  "27: fire fist",
  "28: anime 2d",
]
`
    }
  },

  onStart: async function ({ api, args, event }) {
    try {
      const imageLink = event.messageReply?.attachments?.[0]?.url;

      if (!imageLink) {
        return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
      }

      try {
        const imgurResponse = await axios.get(`https://apis-samir.onrender.com/telegraph?url=${encodeURIComponent(imageLink)}&senderId=${event.senderID}`);

        if (!imgurResponse.data.success) {
          const errorMessage = imgurResponse.data.error;

          if (errorMessage === 'Limit Exceeded') {
            return api.sendMessage('Limit exceeded, try again after 2 hours.', event.threadID, event.messageID);
          } else if (errorMessage === 'Access Forbidden') {
            return api.sendMessage('You are banned because of trying to change credits. Contact admin: [Admin ID](https://www.facebook.com/samir.oe70)', event.threadID, event.messageID);
          }
        }

        const imgur = imgurResponse.data.result.link;
        const filter = args[0];
        const apiUrl = `https://artgen-ai.onrender.com/art?url=${encodeURIComponent(imgur)}&filter=${filter || 0}&apikey=🗿`;
        const imageStream = await global.utils.getStreamFromURL(apiUrl);

        if (!imageStream) {
          return api.sendMessage('Something happened to Server will be fixed within 48 hours', event.threadID, event.messageID);
        }

        return api.sendMessage({ attachment: imageStream }, event.threadID, event.messageID);
      } catch (error) {
        console.error(error);
        return api.sendMessage('Skill issues', event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage('Unknown error', event.threadID, event.messageID);
    }
  }
};