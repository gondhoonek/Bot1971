module.exports = {
  config: {
    name: "bot",
    version: "1.0",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Random auto reply when user types bot"
    },
    description: {
      en: "Replies randomly when someone writes bot"
    },
    category: "auto 🪐",
    guide: {
      en: "Type: bot"
    }
  },

  onStart: async function () {},

  onChat: async function ({ event, message, usersData }) {
    try {
      const text = (event.body || "").toLowerCase();
      if (!text) return;

      // Trigger words
      if (text === "bot" || text === "বট") {
        const name = await usersData.getName(event.senderID);

        const replies = [
          `আপনি কি ফাউন্ডেশনের হাদিয়া পরিশোধ করতে চান তাহলে লিখুন 👉 বিকাশ-নগদ-রকেট 👈`,
          `আপনি কি ফাউন্ডেশনের নিয়ম সম্পর্কে জানতে চান তাহলে লিখুন 👉𝗥𝘂𝗹𝗲𝘀👈`,
          ` ফাউন্ডেশনের সফটওয়্যার সম্পর্কে জানতে লিখুন👉𝗮𝗽𝗽𝘀𝘃𝗱👈`,
          ` ফাউন্ডেশন এর সফটওয়্যার পেতে লিখুন 👉𝗮𝗽𝗽𝘀👈`,
          `ফাউন্ডেশনের অফিসিয়াল গ্রুপ/পেজ পেতে লিখুন 👉𝗣𝗮𝗴𝗲 𝗹𝗶𝗻𝗸 & 𝗴𝗰 𝗹𝗶𝗻𝗸 👈`
        ];

        const random = replies[Math.floor(Math.random() * replies.length)];

        return message.reply(random);
      }

    } catch (err) {
      console.error("Bot CMD Error:", err);
    }
  }
};
