const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "apps video",
    version: "2.1.1",
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

    // 💔 Random sad captions
    const captions = [
      "না টেনে পুরো ভিডিও মনোযোগ সহকারে দেখুন"
    ];

    const caption = captions[Math.floor(Math.random() * captions.length)];

    // 🎥 Sad video link (Catbox)
    const link = "https://files.catbox.moe/rsgdcb.mp4";
    const cachePath = path.join(__dirname, "cache", "sad.mp4");

    try {
      const response = await axios({
        url: link,
        method: "GET",
        responseType: "stream"
      });

      await fs.ensureDir(path.join(__dirname, "cache"));
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
        fs.unlinkSync(cachePath);
      });

      writer.on("error", () => {
        api.sendMessage("❌ ভিডিও পাঠাতে সমস্যা হয়েছে!", event.threadID);
      });

    } catch (error) {
      api.sendMessage("❌ ভিডিও আনতে সমস্যা হয়েছে!", event.threadID);
    }
  }
};
