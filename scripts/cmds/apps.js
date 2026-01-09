module.exports = {
  config: {
    name: "apps",
    version: "1.0",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Auto reply with robot software app link"
    },
    description: {
      en: "Send robot software download link when user types apps"
    },
    category: "auto 🪐",
    guide: {
      en: "Type: apps"
    }
  },

  onStart: async function () {},

  onChat: async function ({ event, message, api }) {
    try {
      // বট যেন নিজের মেসেজে রিপ্লাই না দেয়
      if (event.senderID === api.getCurrentUserID()) return;

      const text = (event.body || "")
        .toLowerCase()
        .trim();

      if (!text) return;

      const keywords = [
        "apps",
        "app",
        "অ্যাপস",
        "অ্যাপ"
      ];

      if (!keywords.includes(text)) return;

      return message.reply(
`╭•┄┅═══❁🤖❁═══┅┄•╮
   🕋আত-তাক্বওয়া ফাউন্ডেশন🕋
╰•┄┅═══❁🤖❁═══┅┄•╯

📱 ডাউনলোড করুন ফাউন্ডেশন এর\n        সফটওয়্যার   
⚡ দ্রুত • নিরাপদ • সহজ

⬇️ Download Link ⬇️\n\n
🔗 https://drive.google.com/file/d/1-8wryqGDNecDTttkoGBmnE_MpAjALqS5/view?usp=drivesdk

✨ এইটি শুধুমাত্র আমাদের ফাউন্ডেশনের  
💙 সহযোদ্ধাদের জন্য `
      );

    } catch (err) {
      console.log("Apps CMD Error:", err);
    }
  }
};
