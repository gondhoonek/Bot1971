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
          `আপনি কি ফাউন্ডেশনের হাদিয়া পরিশোধ করতে চান তাহলে লিখুন 👉 বিকাশ নগদ রকেট 👈`,
          `আপনি কি ফাউন্ডেশনের নিয়ম সম্পর্কে জানতে চান তাহলে লিখুন 👉Rules👈`,
          `আপনি কি ফাউন্ডেশনের সদস্য হতে চান তাহলে লিখুন 👉 সভাপতি & গ্রুপ লিডার ১ & গ্রুপ লিডার ২ & গ্রুপ লিডার ৩👈`,
          `ফাউন্ডেশনের উদ্দেশ্য ও কাজ জানতে লিখুন 👉 ফাউন্ডেশন এর ধারণা & ফাউন্ডেশন এর কাজ & ফাউন্ডেশনের উদ্দেশ্য 👈`,
          `ফাউন্ডেশনের অফিসিয়াল গ্রুপ/পেজ লিংক পেতে লিখুন 👉 page link & gc link 👈`
        ];

        const random = replies[Math.floor(Math.random() * replies.length)];

        return message.reply(random);
      }

    } catch (err) {
      console.error("Bot CMD Error:", err);
    }
  }
};
