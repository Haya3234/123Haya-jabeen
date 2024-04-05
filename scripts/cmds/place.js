module.exports = {
    config: {
        name: "place",
        version: "1.0",
        author: "Hassan",
        countDown: 10,
        shortDescription: {
            en: "Place your bet and see if you win or lose",
        },
        longDescription: {
            en: "Place your bet and see if you win or lose.",
        },
        category: "Game",
    },
    langs: {
        en: {
            not_enough_money: "You do not have enough money to place this bet. Check your balance.",
            bet_placed: "Your bet of $%1 has been placed. Let's see if you win or lose!",
            win_message: "🎉Congratulations! You win $%1",
            lose_message: "🚫Sorry, you lose $%1",
        },
    },
    onStart: async function ({ args, message, event, usersData, getLang }) {
        const { senderID } = event;
        const userData = await usersData.get(senderID);
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            return message.reply("Please enter a valid and positive amount to place your bet.");
        }

        if (amount > userData.money) {
            return message.reply(getLang("not_enough_money"));
        }

        const result = Math.random() < 0.5 ? "win" : "lose";
        const winnings = result === "win" ? amount : -amount;

        await usersData.set(senderID, {
            money: userData.money + winnings,
            data: userData.data,
        });

        return message.reply(getLang(result === "win" ? "win_message" : "lose_message", Math.abs(winnings)));
    },
};