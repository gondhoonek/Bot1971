const fs = require("fs");
const botID = global.GoatBot?.botID || "";

// ডাটা ফাইল
const dataPath = __dirname + "/linkAutoKick.json";

// ডাটা ফাইল না থাকলে তৈরি
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({
        enabledGroups: []   // যেসব গ্রুপে সিস্টেম চালু থাকবে
    }, null, 4));
}

module.exports = {
    config: {
        name: "linkautokick",
        version: "2.0",
        author: "SaGor",
        role: 1,
        shortDescription: "গ্রুপে লিংক দিলে রিমুভ (ON/OFF)",
        longDescription: "নির্দিষ্ট গ্রুপে লিংক দিলে নোটিশ ও রিমুভ, সাথে চালু/বন্ধ করার অপশন।",
        category: "SECURITY",
        guide: {
            bn: "{pn} on\n{pn} off"
        }
    },

    // অ্যাডমিন কমান্ড (চালু/বন্ধ)
    onStart: async function ({ api, event, args }) {
        const threadID = event.threadID;

        const data = JSON.parse(fs.readFileSync(dataPath));

        // চালু
        if (args[0] === "on") {
            if (!data.enabledGroups.includes(threadID)) {
                data.enabledGroups.push(threadID);
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
                return api.sendMessage("✅ লিংক অটো কিক এখন এই গ্রুপে **চালু** করা হলো।", threadID);
            } else {
                return api.sendMessage("ℹ️ এই গ্রুপে ইতোমধ্যে চালু আছে।", threadID);
            }
        }

        // বন্ধ
        if (args[0] === "off") {
            if (data.enabledGroups.includes(threadID)) {
                data.enabledGroups = data.enabledGroups.filter(id => id != threadID);
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
                return api.sendMessage("❌ লিংক অটো কিক এখন এই গ্রুপে **বন্ধ** করা হলো।", threadID);
            } else {
                return api.sendMessage("ℹ️ এই গ্রুপে এটি চালু ছিল না।", threadID);
            }
        }

        return api.sendMessage("⚙️ ব্যবহার:\n• linkautokick on\n• linkautokick off", threadID);
    },

    // মেসেজ মনিটর + লিংক ধরলে রিমুভ
    onChat: async function ({ api, event }) {
        try {
            const { senderID, threadID, messageID, body } = event;

            // ডাটা লোড
            const data = JSON.parse(fs.readFileSync(dataPath));

            // এই গ্রুপে অটো কিক চালু না থাকলে কিছু করবে না
            if (!data.enabledGroups.includes(threadID)) return;

            // বট নিজে হলে স্কিপ
            if (senderID == botID) return;

            // লিংক ডিটেকশন
            const linkRegex = /(https?:\/\/[^\s]+)/gi;
            if (!linkRegex.test(body)) return;

            // নোটিশ
            const warning =
`⚠️ গ্রুপ সিকিউরিটি সতর্কতা!

❌ এই গ্রুপে লিংক দেওয়া নিষিদ্ধ।
➡️ আপনি নিয়ম ভঙ্গ করেছেন, তাই আপনাকে গ্রুপ থেকে রিমুভ করা হচ্ছে।`;

            await api.sendMessage(warning, threadID, messageID);

            // রিমুভ
            return api.removeUserFromGroup(senderID, threadID);

        } catch (e) {
            console.error(e);
        }
    }
};
