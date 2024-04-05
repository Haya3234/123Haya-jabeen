const axios = require('axios');

const Prefixes = [
  'ai',
  'anya',
  'perfect',
  '+ai',
  'hi',
  '.ai',
  'ask',
];

module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "OtinXSandip",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {

      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("𝑨𝒏𝒚𝒂 𝒊𝒔 𝒉𝒆𝒓𝒆 𝒘𝒊𝒍𝒍 𝒚𝒐𝒖 𝒑𝒓𝒐𝒗𝒊𝒅𝒆 𝒎𝒆 𝒕𝒉𝒆 𝒒𝒖𝒆𝒔𝒕𝒊𝒐𝒏 𝒕𝒐 𝒔𝒐𝒍𝒗𝒆 𝒊𝒕 (•̀ᴗ•́)و");
        return;
      }


      const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;


    await message.reply({ body: `𝑴𝑹 𝑷𝑬𝑹𝑭𝑬𝑪𝑻 𝑨𝑰
______________________________  
${answer}
𝑩𝒐𝒕 𝒐𝒘𝒏𝒆𝒓 
m.me/100087591006635`,
});

   } catch (error) {
      console.error("Error:", error.message);
    }
  }
};