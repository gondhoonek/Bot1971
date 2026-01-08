module.exports = {
  config: {
    name: "hadiya",
    version: "1.0",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Auto reply for hadiya numbers (exact match)"
    },
    description: {
      en: "Exact text match auto reply using const keyword list"
    },
    category: "auto 🪐",
    guide: {
      en: ""
    }
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    try {
      const text = (event.body || "").trim().toLowerCase();
      if (!text) return;

      // 👉 শুধু এখানে যে শব্দ/বাক্যগুলো থাকবে — ঠিক সেগুলোর সাথে মিললে reply যাবে
      const keywords = [
        "bikash",
        "বিকাশ",
        "nagad",
        "নগদ",
        "rocket",
        "রকেট",
        "নাম্বার দাও",
        "টাকা পাঠাবো",
        "হাদিয়া পাঠাবো",
        "taka pathabo",
        "hadiya dibo"
      ];

      // Exact match only — mixed text হলে reply যাবে না
      if (keywords.includes(text)) {
        return message.reply(
`╭•┄┅═══❁🌺❁═══┅┄•╮
  📱 01615101797 📱
╰•┄┅═══❁🌺❁═══┅┄•╯

✿🦋 প্রিয় সদস্য ✨🧡`
        );
      }

    } catch (err) {
      console.log("Hadiya CMD Error:", err);
    }
  }
};
