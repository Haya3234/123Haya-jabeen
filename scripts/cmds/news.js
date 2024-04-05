const axios = require('axios');

module.exports = {
  config: {
    name: "news",
    aliases: [],
    author: "kshitiz",
    version: "2.0",
    cooldown: 5,
    role: 0,
    shortDescription: {
      en: "search and get news"
    },
    longDescription: {
      en: "search and get news"
    },
    category: "????",
    guide: {
      en: "{p}{n} [search]"
    }
  },
  onStart: async function ({ api, event, args }) { 
    try {
      const apiKey = 'pub_3120796ef3315b3c51e7930d31ee6322ae911'; 
      const country = 'np'; 
      const response = await axios.get(`https://newsdata.io/api/1/news?country=${country}&apikey;=${apiKey}`);
      const newsdata = response.data.results;

      const articlesPerPage = 5; 
      let message = 'Latest news:\\';
      let page = 1;

      for (const article of newsdata) {
        message += `Title: ${article.title}\Source: ${article.source}\Description: ${article.description}\Link: ${article.link}\\`;

        if (message.length > 4000) {
          break; 
        }
      }

      if (message === 'Latest news:\\') {
        message = 'No news articles found.';
      }

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error('Something went wrong:', error);
      api.sendMessage('Something went wrong while fetching from the API. Please try again.', event.threadID, event.messageID);
    }
  }
};