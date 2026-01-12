const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "appsvd",
    version: "2.1.4",
    author: "apps video",
    countDown: 5,
    role: 0,
    shortDescription: "apps video",
    longDescription: "Sends random sad video with emotional captions 💔",
    category: "video",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {

    const captions = [
      "না টেনে পুরো ভিডিও মনোযোগ সহকারে দেখুন 💔"
    ];
    const caption = captions[Math.floor(Math.random() * captions.length)];

    const link = "https://files.catbox.moe/rsgdcb.mp4";
    const cacheDir = path.join(__dirname, "cache");
    const cachePath = path.join(cacheDir, "sad.mp4");

    const loadingMsg = await api.sendMessage(
      "⏳ ভিডিও লোড হচ্ছে, একটু অপেক্ষা করুন...",
      event.threadID
    );

    try {
      const response = await axios({
        url: link,
        method: "GET",
        responseType: "stream"
      });

      await fs.ensureDir(cacheDir);
      const writer = fs.createWriteStream(cachePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        await api.sendMessage(
          {
            body: `「 ${caption} 」`,
            attachment: fs.createReadStream(cachePath)
          },
          event.threadID
        );

        setTimeout(() => {
          api.unsendMessage(loadingMsg.messageID);
          fs.unlinkSync(cachePath);
        }, 2000);
      });

      writer.on("error", () => {
        api.unsendMessage(loadingMsg.messageID);
        api.sendMessage("❌ ভিডিও পাঠাতে সমস্যা হয়েছে!", event.threadID);
      });

    } catch (error) {
      api.unsendMessage(loadingMsg.messageID);
      api.sendMessage("❌ ভিডিও আনতে সমস্যা হয়েছে!", event.threadID);
    }
  }
};
