const fs = require("fs");
const path = __dirname + "/linkKickData.json";

// ডাটা ফাইল না থাকলে তৈরি করো
if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({ allowedGroups: [] }, null, 4));
}

module.exports = {
    config: {
        name: "linkkick",
        version: "1.2",
        author: "SaGor",
        role: 1,
        shortDescription: "লিংক দিলে রিমুভ করবে",
        longDescription: "নির্দিষ্ট গ্রুপে কেউ লিংক দিলে নোটিশ দিয়ে রিমুভ করবে (এডমিনরা বাদ)",
        category: "group",
        guide: "{pn} on/off"
    },

    // ON/OFF Command
    onStart: async function ({ message, event, args }) {
        const data = JSON.parse(fs.readFileSync(path));

        if (!args[0]) return message.reply("Usage:\nlinkkick on/off");

        if (args[0] === "on") {
            if (!data.allowedGroups.includes(event.threadID)) {
                data.allowedGroups.push(event.threadID);
                fs.writeFileSync(path, JSON.stringify(data, null, 4));
            }
            return message.reply("✅ এখন থেকে এই গ্রুপে লিংক দিলেই রিমুভ হবে (এডমিন বাদ)।");
        }

        if (args[0] === "off") {
            data.allowedGroups = data.allowedGroups.filter(id => id !== event.threadID);
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
            return message.reply("❌ এই গ্রুপে লিংক প্রটেকশন বন্ধ করা হলো।");
        }
    },

    // চ্যাট মনিটর
    onChat: async function ({ api, event }) {
        const data = JSON.parse(fs.readFileSync(path));

        // অনুমোদিত গ্রুপে কাজ করবে
        if (!data.allowedGroups.includes(event.threadID)) return;

        // থ্রেড ইনফো
        const threadInfo = await api.getThreadInfo(event.threadID);

        // বট এডমিন না হলে কিছুই করবে না
        if (!threadInfo.adminIDs.some(a => a.id == api.getCurrentUserID())) return;

        const msg = event.body?.toLowerCase() || "";

        // সব ধরনের লিংক ধরার জন্য Regex
        const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|\b[a-z0-9\-]+\.(com|net|xyz|info|org)\b)/gi;

        // যদি লিংক না থাকে
        if (!linkRegex.test(msg)) return;

        // ❗ এডমিন লিংক দিলে স্কিপ করবে
        if (threadInfo.adminIDs.some(a => a.id == event.senderID)) {
            return; // এডমিনকে রিমুভ করবে না
        }

        // নোটিশ
        const notice =
`⚠️ সতর্কবার্তা! ⚠️

আপনি গ্রুপে লিংক শেয়ার করেছেন, যা এই গ্রুপের নিয়মের বিরোধী।  
গ্রুপকে নিরাপদ রাখতে লিংক শেয়ার করা নিষিদ্ধ।

📌 আপনাকে গ্রুপ থেকে রিমুভ করা হচ্ছে।

ধন্যবাদ। 🙏`;

        await api.sendMessage(notice, event.threadID);

        // রিমুভ
        try {
            await api.removeUserFromGroup(event.senderID, event.threadID);
        } catch (e) {
            await api.sendMessage("❌ আমাকে এডমিন বানাও। না হলে রিমুভ করতে পারব না!", event.threadID);
        }
    }
};
