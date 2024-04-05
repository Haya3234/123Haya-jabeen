module.exports = {
  config: {
      name: "hello",
     aliases: [],
      version: "1.0",
      author: "yukinori",
      countDown: 5,
      role: 0,
      shortDescription: "sarcasm",
      longDescription: "sarcasm",
      category: "reply",
  },
onStart: async function(){}, 
onChat: async function({
  event,
  message,
  getLang
}) {
  if (event.body && event.body.toLowerCase() == "hello") return message.reply("Hello! I'm here to help you with anything you need. Feel free to ask me any questions or share anything you'd like to discuss. I'm here to make your experience as pleasant as possible!");
}
};