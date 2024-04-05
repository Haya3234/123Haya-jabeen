const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "mj",
    aliases: [],
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "",
    longDescription: "generate image using midjourney",
    category: "image",
    guide: "{p}mj prompt",
  },

  onStart: async function ({ api, event, args, message }) {
    const p = args.join(" ");

    if (!p) {
      message.reply("Please provide a prompt.");
      return;
    }

    try {
      const r = await axios.get(`https://mid-journey-delta.vercel.app/mj?prompt=${encodeURIComponent(p)}`);

      const v = r.data.Url[0];

      if (!v) {
        message.reply("error from mj api");
        return;
      }

      const t = path.join(__dirname, "cache", `chudmarani.mp4`);

      const w = fs.createWriteStream(t);

      const vr = await axios.get(v, { responseType: "stream" });
      vr.data.pipe(w);

      w.on("finish", () => {
        const s = fs.createReadStream(t);

        message.reply({
          body: `your request🗿"`,
          attachment: s,
        });
      });
    } catch (e) {
      console.error(e);
      message.reply("Sorry, an error occurred while processing your request.");
    }
  }
};
