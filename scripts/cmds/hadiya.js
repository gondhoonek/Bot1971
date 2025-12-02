module.exports = {
  config: {
    name: "hadiya",
    version: "1.0",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Auto reply for hadiya numbers"
    },
    description: {
      en: "Auto reply on chat when user says payment related keywords"
    },
    category: "auto 🪐",
    guide: {
      en: ""
    }
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    const text = event.body?.toLowerCase();
    if (!text) return;

    // Keywords list
    const keywords = [
      "bikash", "বিকাশ",
      "nagad", "নগদ",
      "rocket", "রকেট",
      "নাম্বার দাও",
      "টাকা পাঠাবো",
      "হাদিয়া পাঠাবো",
      "taka pathabo",
      "hadiya dibo"
    ];

    // Check if includes any keyword
    if (keywords.some(k => text.includes(k))) {
      return message.reply({
        body: `╭•┄┅═══❁🌺❁═══┅┄•╮
       📱01615101797📱
╰•┄┅═══❁🌺❁═══┅┄•╯

✿🦋༎প্রিয় সদস্য༎✨🧡`,
        attachment: await global.utils.getStreamFromURL(
          "https://i.ibb.co/3yQkd1bt/photo.jpg"
        )
      });
    }
  }
}
