const fs = require("fs");
const path = __dirname + "/linkKickData.json";

// ডাটা ফাইল না থাকলে তৈরি করো
if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({ allowedGroups: [] }, null, 4));
}

module.exports = {
    config: {
        name: "linkkick",
        version: "1.0",
        author: "SaGor",
        role: 1,
        shortDescription: "গ্রুপে লিংক দিলে রিমুভ করবে",
        longDescription: "নির্দিষ্ট গ্রুপে কেউ লিংক দিলে সতর্কবার্তা দেখিয়ে গ্রুপ থেকে রিমুভ করবে",
        category: "group",
        guide: "{pn} on/off - এই গ্রুপে লিংক প্রটেকশন চালু/বন্ধ করবে"
    },

    // কমান্ড দিয়ে এডমিন অনুমতি
    onStart: async function ({ message, event, args }) {
        const data = JSON.parse(fs.readFileSync(path));

        if (!args[0]) return message.reply("Usage:\nlinkkick on/off");

        if (args[0] === "on") {
            if (!data.allowedGroups.includes(event.threadID)) {
                data.allowedGroups.push(event.threadID);
                fs.writeFileSync(path, JSON.stringify(data, null, 4));
            }
            return message.reply(" এবার দেখবো কে লিংক দেয়");
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

        // বট এডমিন না হলে কাজ করবে না
        const threadInfo = await api.getThreadInfo(event.threadID);
        if (!threadInfo.adminIDs.some(a => a.id == api.getCurrentUserID())) return;

        const msg = event.body?.toLowerCase() || "";

        // লিংক চেক
        if (msg.includes("http://") || msg.includes("https://") || msg.includes("www.")) {

            const notice = 
`⚠️ সতর্কবার্তা! ⚠️

আপনি এই গ্রুপে লিংক শেয়ার করেছেন, যা গ্রুপের নিয়মের সম্পূর্ণ বিরোধী।  
গ্রুপকে নিরাপদ রাখার জন্য, এই ধরনের লিংক শেয়ার করা সম্পূর্ণ নিষিদ্ধ।  

➡️ তাই আপনাকে গ্রুপ থেকে রিমুভ করা হচ্ছে।  
অনুগ্রহ করে ভবিষ্যতে নিয়ম মেনে চলুন।`;

            await api.sendMessage(notice, event.threadID);

            // রিমুভ
            try {
                await api.removeUserFromGroup(event.senderID, event.threadID);
            } catch (e) {
                await api.sendMessage("❌ আমাকে এডমিন বানাও। না হলে রিমুভ করতে পারব না।", event.threadID);
            }
        }
    }
};
