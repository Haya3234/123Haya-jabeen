const axios = require('axios');

module.exports = {
  config: {
    name: 'alienrizz',
    version: '1.0',
    author: 'kshitiz',
    countDown: 0,
    role: 0,
    category: 'fun',
    shortDescription: {
      en: 'Sends a random alien-themed pickup line.'
    },
    longDescription: {
      en: 'Use this command to impress someone with an alien-themed pickup line.'
    },
    guide: {
      en: '{pn} alienrizz @mention'
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
      const mention = Object.keys(event.mentions);
      const response = await axios.get('https://kshitiz-project.onrender.com/kshitiz');

      if (response.status !== 200 || !response.data || !response.data.pickup_line) {
        throw new Error('Invalid');
      }

      let pickupline = response.data.pickup_line;
      let message = pickupline;

      if (mention.length === 1) {
        const mentionName = event.mentions[mention[0]].replace('@', '');
        message = `${mentionName}, ${pickupline} 👽`;
      }

      const attachment = await api.sendMessage({
        body: message,
        mentions: mention.map(mentionID => ({
          tag: event.mentions[mentionID],
          id: mentionID,
          fromIndex: message.indexOf('@' + event.mentions[mentionID].replace('@', '')),
          toIndex: message.indexOf('@' + event.mentions[mentionID].replace('@', '')) + event.mentions[mentionID].length,
        })),
      }, event.threadID, event.messageID);

      if (!attachment || !attachment.messageID) {
        throw new Error('Failed to send message');
      }

      console.log(`Sent`);
    } catch (error) {
      console.error(`Failed to send alien pickup line: ${error.message}`);
      api.sendMessage('Please try again later.', event.threadID, event.messageID);
    }
  }
};