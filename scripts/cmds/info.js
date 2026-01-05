const moment = require('moment-timezone');
const axios = require('axios');

module.exports = {
  config: {
    name: "info",
    aliases: ["inf", "in4"],
    version: "3.7",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Shows bot and owner info with photo."
    },
    longDescription: {
      en: "Displays detailed information about the bot and owner, including uptime, ping, social links, and local time, with a profile photo."
    },
    category: "Information",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    this.sendInfo(message);
  },

  onChat: async function ({ event, message }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.sendInfo(message);
    }
  },

  sendInfo: async function (message) {
    const botName = "AT-ᴛᴀqᴡᴀ ꜰᴏᴜɴᴅᴀᴛɪᴏɴ";
    const ownerName = "AT-ᴛᴀqᴡᴀ ꜰᴏᴜɴᴅᴀᴛɪᴏɴ";
    const moderatedBy = "AT-ᴛᴀqᴡᴀ ꜰᴏᴜɴᴅᴀᴛɪᴏɴ";
    const religion = "ISLAM";
    const botStatus = "ᴀʟʟᴀʜ";
    const address = "ꜰᴀᴄᴇʙᴏᴏᴋ ᴍɪᴅɪʏᴀ";
    const userClass = "ɪꜱʟᴀᴍɪᴄ ᴊᴏʙ";
    const facebook = "https://www.facebook.com/Islamic.Fundation";
    const tiktok = "https://m.me/j/Abawo-69GGiHYihE/";

    const now = moment().tz('Asia/Dhaka');
    const localTime = now.format('hh:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, 100));
    const ping = Date.now() - start;

    const photoUrl = "https://i.imgur.com/vl1e95d.jpeg";

    const body = `
╭─ <𝐎𝐖𝐍𝐄𝐑  𝐈𝐍𝐅𝐎> ─╮
├──────────────⍟
│ 👑 𝙾𝚆𝙽𝙴𝚁 : ${ownerName}
│ ⚙️ 𝙼𝙾𝙳𝙴𝚁𝙰𝚃𝙴𝙳 𝙱𝚈 : ${moderatedBy}
│ 🏫 𝚆𝙾𝚁𝙺 : ${userClass}
│ 🏠 𝙰𝙳𝙳𝚁𝙴𝚂𝚂 : ${address}
│ 🌍 𝚁𝙴𝙻𝙸𝙶𝙸𝙾𝙽 : ${religion}
│ 🧬 𝚂𝚃𝙰𝚃𝚄𝚂 : ${botStatus}
│ 📘 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 : ${facebook}
│ 📸 𝚃𝙴𝚇𝚃 𝙱𝙾𝚇 : ${tiktok}
├───────────⍟
│
│𖣘 <🅑︎🅞︎🅣︎ 🅘︎🅝︎🅕︎🅞︎> 𖣘
├───────────⍟
│ 🤖 𝙱𝙾𝚃 𝙽𝙰𝙼𝙴: ${botName}
│ 🕐 𝚃𝙸𝙼𝙴: ${localTime}
│ 🌀 𝚄𝙿𝚃𝙸𝙼𝙴: ${uptimeString}
│ ⚡ 𝙿𝙸𝙽𝙷: ${ping}𝐦𝐬
╰───────────╯
`;

    try {
      const response = await axios.get(photoUrl, { responseType: 'stream' });
      message.reply({ body, attachment: response.data });
    } catch {
      message.reply("⚠️ Failed to load photo.");
    }
  }
};
