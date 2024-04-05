const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "dalle",
    version: "1.0.2",
    author: "Rehat86@তুরতুল",
    role: 0,
    countDown: 5,
    longDescription: {
      en: "Generate images using dalle 3"
    },
    category: "ai",
    guide: {
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const permission = ["100087591006635"];
    if (!permission.includes(event.senderID)) {
      api.sendMessage(
        "~Oh Baka! Seems you don't have permission to use this command!🐱",
        event.threadID,
        event.messageID
      );
      return;
    }

    const keySearch = args.join(" ");
if (!keySearch) return message.reply("Add something baka.");
    message.reply("Please wait...⏳");

    try {
        const res = await axios.get(`https://api-turtle.onrender.com/api/dalle?prompt=${keySearch}&cookie=1joTLu3Y8pQTj8zL7wqTEKnb-8hDfgqdnHoDPTdSQs1HOSN0KtdVaVWY5oiSgklGX18ZgZDUnlue-opqbQN2KIJN7qftrrTe3r9NskfhuPXu_ZEQsncyrEVGP6sCxVHdNed8ZxrJ0zt2lhInbMBx2Po7CQUzwA54BwELU6dz2nnDLMG-5eGHFNpxfNZRUfDKqwBUhTxC3jdt2CvTnvxmZOA`);
        const data = res.data.result; // Change from res.data.results.images to res.data.result

        if (!data || data.length === 0) {
            api.sendMessage("An error occurred.", event.threadID, event.messageID);
            return;
        }

        const imgData = [];
        for (let i = 0; i < data.length; i++) { // No need to limit to Math.min(numberSearch, data.length)
            const imgUrl = data[i];
            const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
            const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
            await fs.outputFile(imgPath, imgResponse.data);
            imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage({
            attachment: imgData,
        }, event.threadID, event.messageID);

    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred.", event.threadID, event.messageID);
    } finally {
        await fs.remove(path.join(__dirname, 'cache'));
    }
  }
}