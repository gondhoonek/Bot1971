const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "sad",
    version: "2.1.1",
    author: "chudi",
    countDown: 5,
    role: 0,
    shortDescription: "Sad video sender 😢",
    longDescription: "Sends random sad video with emotional captions 💔",
    category: "video",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {

    // 💔 Random sad captions
    const captions = [
      "তুমি ছিলে আমার গল্পের সবচেয়ে সুন্দর অধ্যায় 💔",
      "ভালোবাসা পাইনি, শুধু হারানোর ভয় পেয়েছি 🥀",
      "কেউ আমার অপেক্ষা করে না এখন, শুধু আমি করি… 😔",
      "চোখের জলেও একটা গল্প থাকে, শুধু দেখা যায় না 💧",
      "হাসির আড়ালে লুকিয়ে থাকে কত না কষ্ট 😅💔",
      "তোমার স্মৃতি এখনো ঘুম ভাঙিয়ে দেয় 🌙",
      "আমি ভুলিনি, শুধু মনে রাখাটা থামিয়ে দিয়েছি 💭",
      "কখনো কখনো নীরবতাই সবচেয়ে বড় উত্তর 😶‍🌫️",
      "যাকে চাই, সে-ই সবচেয়ে দূরে থাকে 💔",
      "সব ঠিক আছি বললেও, মনটা কিন্তু ঠিক নেই 🥀"
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
