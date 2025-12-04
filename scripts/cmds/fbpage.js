module.exports = {
  config: {
    name: "fbpage",
    version: "1.0",
    author: "SaGor",
    countDown: 3,
    role: 0,
    shortDescription: "Auto reply Facebook/Page links",
    longDescription: "Sends preset Facebook group or page link when users type 'ফেসবুক' or 'পেজ'",
    category: "utility",
    guide: {
      en: "Type ফেসবুক or পেজ to get the link"
    }
  },

  onStart: async function ({ api, event }) {
    const botID = api.getCurrentUserID();
  },

  onChat: async function ({ api, event }) {
    const msg = event.body?.toLowerCase();
    if (!msg) return;

    // -----------------------------
    // আপনার কাস্টম লিংক এখানে সেট করুন
    // -----------------------------
    const links = {
      facebook: "https://facebook.com/groups/islamik.life1/",
      page: "https://www.facebook.com/Islamic.Fundation"
    };

    // -----------------------------
    // ফেসবুক keyword
    // -----------------------------
    if (msg.includes("ফেসবুক") || msg.includes("facebook")) {
      return api.sendMessage(
        {
          body: "📌 আপনার ফেসবুক লিংক:\n" + links.facebook,
          buttons: [
            {
              type: "web_url",
              url: links.facebook,
              title: "Open Facebook"
            }
          ]
        },
        event.threadID,
        event.messageID
      );
    }

    // -----------------------------
    // পেজ keyword
    // -----------------------------
    if (msg.includes("পেজ") || msg.includes("page")) {
      return api.sendMessage(
        {
          body: "📌 আপনার পেজ লিংক:\n" + links.page,
          buttons: [
            {
              type: "web_url",
              url: links.page,
              title: "Open Page"
            }
          ]
        },
        event.threadID,
        event.messageID
      );
    }
  }
};
