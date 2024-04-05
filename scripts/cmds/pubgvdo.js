const axios = require("axios");
const fs = require("fs-extra");
const os = require("os");
const ytdl = require("@distube/ytdl-core");

module.exports = {
  sentVideos: [],

  config: {
    name: "pubgvdo",
    version: "2.0",
    role: 0,
    author: "Kshitiz",
    cooldowns: 5,
    shortDescription: "",
    longDescription: "get Free Fire edits videos from YouTube",
    category: "video",
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "ytdl-core": "",
      "yt-search": ""
    }
  },

  onStart: async function ({ api, event, message }) {
    try {
      const senderID = event.senderID;

      const loadingMessage = await api.sendMessage("Loading random pubg video 💖...", event.threadID, null, event.messageID);

      const apiKey = "AIzaSyAO1tuGus4-S8RJID51f8WJAM7LXz1tVNc";
      const playlistId = "PLCiXFxWx8d2Br6CneoQUiq9mM8OB2MEb8";

      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=contentDetails&maxResults=50`;
      const response = await axios.get(playlistUrl);

      const items = response.data.items;
      const videoIds = items.map((item) => item.contentDetails.videoId);

      if (this.sentVideos.length === videoIds.length) {
        this.sentVideos = [];
      }

      const unwatchedVideoIds = videoIds.filter((videoId) => !this.sentVideos.includes(videoId));

      if (unwatchedVideoIds.length === 0) {
        api.unsendMessage(loadingMessage.messageID);
        return api.sendMessage("something went wrong", event.threadID, null, event.messageID);
      }

      const randomVideoId = unwatchedVideoIds[Math.floor(Math.random() * unwatchedVideoIds.length)];

      this.sentVideos.push(randomVideoId);

      const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${randomVideoId}&part=snippet,contentDetails`;
      const videoResponse = await axios.get(videoDetailsUrl);

      const videoInfo = videoResponse.data.items[0].snippet;
      const foundVideo = videoResponse.data.items[0];

      const randomVideoTitle = videoInfo.title;

      const stream = ytdl(randomVideoId, { filter: "audioandvideo" });
      const fileName = `${senderID}.mp4`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', () => {
        console.info('[DOWNLOADER]', `Downloading video: ${randomVideoTitle}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);

          api.unsendMessage(loadingMessage.messageID);
          return api.sendMessage('❌ | Give a next try again 🥱', event.threadID, null, event.messageID);
        }

        const message = {
          body: `📹 | Here's the random pubg video.`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, null, event.messageID, () => {
          fs.unlinkSync(filePath);
        });

        setTimeout(() => {
          api.unsendMessage(loadingMessage.messageID);
        }, 10000);
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('An error occurred while processing the command.', event.threadID, null, event.messageID);
    }
  },
};
