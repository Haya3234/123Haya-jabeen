const fs = require("fs-extra");

module.exports = {

  config: {
    name: 'store',
    aliases: [],
    version: '1.0',
    author: 'Kshitiz',
    countDown: 5,
    role: 0,
    shortDescription: 'Store and retrieve messages',
    longDescription: 'Store and retrieve messages',
    category: 'utility',
    guide: {
      en: 'To store a message: {p}store {title} | {content}\nTo show stored messages: {p}store show\nTo delete a message: {p}store del | {title}',
    }
  },

  onStart: async function ({ api, event, args }) {
    const senderID = event.senderID;

    try {
   
      const dirPath = `./data/${senderID}`;
      await fs.ensureDir(dirPath);

      if (args.length === 0) {
        api.sendMessage('Usage: {p}store {title} | {content}', event.threadID, event.messageID);
        return;
      }

      if (args[0] === 'show') {
        const files = await fs.readdir(dirPath);

        if (files.length === 0) {
          api.sendMessage('No stored messages found.', event.threadID, event.messageID);
          return;
        }

        let message = '';
        let count = 1;
        for (const file of files) {
          const filePath = `${dirPath}/${file}`;
          const title = file.replace('.json', '');
          const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
          message += `${count}. Title: ${title}\nContent: ${content.content}\n\n`;
          count++;
        }

        api.sendMessage(message, event.threadID, event.messageID);
        return;
      }

      if (args[0] === 'del') {
        if (args.length < 2) {
          api.sendMessage('Usage: {p}store del | {title}', event.threadID, event.messageID);
          return;
        }

        const titleToDelete = args.slice(1).join(' ');
        const filePathToDelete = `./data/${senderID}/${titleToDelete}.json`;

        if (await fs.pathExists(filePathToDelete)) {
          await fs.unlink(filePathToDelete);
          api.sendMessage(` "${titleToDelete}" deleted successfully.`, event.threadID, event.messageID);
        } else {
          api.sendMessage(`"${titleToDelete}" not found.`, event.threadID, event.messageID);
        }
        return;
      }

      const input = args.join(' ');
      const [title, content] = input.split('|').map(part => part.trim());

      if (!title || !content) {
        api.sendMessage('Incorrect format. Use {title} | {content}.', event.threadID, event.messageID);
        return;
      }

      const filePath = `./data/${senderID}/${title}.json`;
      await fs.writeFile(filePath, JSON.stringify({ content }, null, 2));

      api.sendMessage('Message stored successfully.', event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage('An error occurred.', event.threadID, event.messageID);
    }
  }
};
