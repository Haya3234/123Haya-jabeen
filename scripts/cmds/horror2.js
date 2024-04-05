const axios = require('axios');

module.exports = {
  config: {
    name: "horror2",
    aliases: ["scar"],
    version: "1.7",
    author: "Hassan",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Send hình ảnh cố định",
      en: "Send specific image"
    },
    longDescription: {
      vi: "Gửi hình ảnh cố định được xác định trước",
      en: "Send a specific predefined image"
    },
    category: "image",
    guide: {
      vi: "{pn}",
      en: "{pn}"
    }
  },

  images: [
    "https://tinyurl.com/282gbkfx",
    "https://tinyurl.com/22p7xxdp",
    "https://tinyurl.com/2yf73b6t",
    "https://tinyurl.com/2d72jzrz",
    "https://tinyurl.com/2xoj86a5",
    "https://tinyurl.com/22klxrnb",
    "https://tinyurl.com/28krbptg",
    "https://tinyurl.com/2bxxdmsu",
    "https://tinyurl.com/2c6636x7",
    "https://tinyurl.com/27vbg56s",
    "https://tinyurl.com/2cv6x959",
    "https://tinyurl.com/29v5nkuz",
    "https://tinyurl.com/263g97m9",
    "https://tinyurl.com/27s8jcak",
    "https://tinyurl.com/2bpvyo39",
    "https://tinyurl.com/yqrfq5w6",
    "https://tinyurl.com/ysaxvyx3",
    "https://tinyurl.com/ytwatpnl",
    "https://tinyurl.com/yqkucr5h",
    "https://tinyurl.com/ym5w8hyk",
    "https://tinyurl.com/yugbbx7u",
    "https://tinyurl.com/ynrs2dmm",
    "https://tinyurl.com/yot4rfnf",
    "https://tinyurl.com/ysrfh3js"
  ],

  onStart: async function({ message }) {
    try {
      const randomImageUrl = this.images[Math.floor(Math.random() * this.images.length)];
      const response = await axios.get(randomImageUrl, { responseType: 'stream' });

      return message.reply({
        attachment: response.data
      });
    } catch (error) {
      console.error("Error while retrieving the specific image:", error);
      return message.reply("An error occurred while processing your request.");
    }
  }
};