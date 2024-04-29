module.exports = {
	config: {
		name: "adc",
		aliases: ["ad"],
		version: "1.2",
		author: "Loid butter",
		countDown: 0,
		role: 2,
		shortDescription: {
			vi: "",
			en: "adc command"
		},
		longDescription: {
			vi: "",
			en: "only bot owner"
		},
		category: "owner", 
		guide: {
			en: "{pn}"
		}
	},
	
onStart: async function({ api, event, args }) {
  const permission = ["100083551732772"];
 if (!permission.includes(event.senderID))
 return api.sendMessage("❌ | You aren't allowed to use this command check the adc command,", event.threadID, event.messageID);
    const axios = require('axios');
    const fs = require('fs');
    const request = require('request');
    const cheerio = require('cheerio');
    const { join, resolve } = require("path");
    const { senderID, threadID, messageID, messageReply, type } = event;
    var name = args[0];
    if (type == "message_reply") {
        var text = messageReply.body;
    }
    if(!text && !name) return api.sendMessage('Please reply to the link you want to apply the code to or write the file name to upload the code to pastebin!', threadID, messageID);
    if(!text && name) {
        var data = fs.readFile(
          `${__dirname}/${args[0]}.js`,
          "utf-8",
          async (err, data) => {
            if (err) return api.sendMessage(`Command ${args[0]} does not exist!.`, threadID, messageID);
            const { PasteClient } = require('pastebin-api')
            const client = new PasteClient("N5NL5MiwHU6EbQxsGtqy7iaodOcHithV");
            async function pastepin(name) {
              const url = await client.createPaste({
                code: data,
                expireDate: 'N',
                format: "javascript",
                name: name,
                publicity: 1
              });
              var id = url.split('/')[3]
              return 'https://pastebin.com/raw/' + id
            }
            var link = await pastepin(args[1] || 'noname')
            return api.sendMessage(link, threadID, messageID);
          }
        );
        return
    }
    var urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    var url = text.match(urlR);
    if (url[0].indexOf('pastebin') !== -1) {
        axios.get(url[0]).then(i => {
            var data = i.data
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                data,
                "utf-8",
                function (err) {
                    if (err) return api.sendMessage(`An error occurred while applying the code ${args[0]}.js`, threadID, messageID);
                    api.sendMessage(`Applied the code to ${args[0]}.js, use command load to use!`, threadID, messageID);
                }
            );
        })
    }

    if (url[0].indexOf('buildtool') !== -1 || url[0].indexOf('tinyurl.com') !== -1) {
        const options = {
            method: 'GET',
            url: messageReply.body
        };
        request(options, function (error, response, body) {
            if (error) return api.sendMessage('Please only reply to the link (doesnt contain anything other than the link)', threadID, messageID);
            const load = cheerio.load(body);
            load('.language-js').each((index, el) => {
                if (index !== 0) return;
                var code = el.children[0].data
                fs.writeFile(`${__dirname}/${args[0]}.js`, code, "utf-8",
                    function (err) {
                        if (err) return api.sendMessage(`An error occurred while applying the new code to "${args[0]}.js".`, threadID, messageID);
                        return api.sendMessage(`Added this code "${args[0]}.js", use command load to use!`, threadID, messageID);
                    }
                );
            });
        });
        return
    }
    if (url[0].indexOf('drive.google') !== -1) {
      var id = url[0].match(/[-\w]{25,}/)
      const path = resolve(__dirname, `${args[0]}.js`);
      try {
        await utils.downloadFile(`https://drive.google.com/u/0/uc?id=${id}&export=download`, path);
        return api.sendMessage(`Added this code "${args[0]}.js" If there is an error, change the drive file to txt!`, threadID, messageID);
      }
      catch(e) {
        return api.sendMessage(`An error occurred while applying the new code to "${args[0]}.js".`, threadID, messageID);
      }
    }
  }
      }