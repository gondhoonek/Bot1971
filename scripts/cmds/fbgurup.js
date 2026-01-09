module.exports = {
  config: {
    name: "fbgrouppage",
    version: "1.0",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Send FB group or page link by keyword"
    },
    description: {
      en: "Auto reply Facebook group or robot page link separately"
    },
    category: "auto 🪐",
    guide: {
      en: "Type: facebook group / facebook page"
    }
  },

  onStart: async function () {},

  onChat: async function ({ event, message, api }) {
    try {
      // বট নিজের মেসেজে রিপ্লাই দেবে না
      if (event.senderID === api.getCurrentUserID()) return;

      const text = (event.body || "").toLowerCase().trim();
      if (!text) return;

      /* 👉 Facebook Group keywords */
      const groupKeywords = [
        "facebook group",
        "fb group",
        "gurup",
        "ফেসবুক গ্রুপ",
        "গ্রুপ"
      ];

      /* 👉 Facebook Page keywords */
      const pageKeywords = [
        "facebook page",
        "fb page",
        "page",
        "ফেসবুক পেজ",
        "পেজ"
      ];

      /* ===== Facebook Group Reply ===== */
      if (groupKeywords.includes(text)) {
        return message.reply(
`╭•┄┅═══❁👥❁═══┅┄•╮
     🕋আত-তাক্বওয়া ফাউন্ডেশন🕋
╰•┄┅═══❁👥❁═══┅┄•╯

🌐 আমাদের অফিসিয়াল Facebook Group  
এখনই জয়েন করুন 👇

🔗 https://facebook.com/groups/islamik.life1/

✨ নিয়মিত আপডেট পেতে  
💙 সবাইকে জয়েন করার জন্য অনুরোধ রইলো`
        );
      }

      /* ===== Facebook Page Reply ===== */
      if (pageKeywords.includes(text)) {
        return message.reply(
`╭•┄┅═══❁📄❁═══┅┄•╮
    🕋আত-তাক্বওয়া ফাউন্ডেশন🕋
╰•┄┅═══❁📄❁═══┅┄•╯

📣 আমাদের অফিসিয়াল  Page  
Follow করুন এবং সাথে থাকুন 👇

🔗 https://www.facebook.com/Islamic.Fundation

✨ নতুন আপডেট সবার আগে পেতে  
💙 সবাইকে Follow করার জন্য অনুরোধ`
        );
      }

    } catch (err) {
      console.log("FB Group/Page Error:", err);
    }
  }
};
