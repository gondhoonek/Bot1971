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
        shortDescription: "গ্রুপে লিংক দিলে রিমুভ করবে",
        longDescription: "এডমিন ছাড়া কেউ লিংক দিলে সতর্কবার্তা দিয়ে রিমুভ করবে।",
        category: "group",
        guide: "{pn} on/off"
    },

    onStart: async function ({ message, event, args }) {
        const data = JSON.parse(fs.readFileSync(path));

        if (!args[0]) return message.reply("Usage:\n{pn} on/off");

        if (args[0] === "on") {
            if (!data.allowedGroups.includes(event.threadID)) {
                data.allowedGroups.push(event.threadID);
                fs.writeFileSync(path, JSON.stringify(data, null, 4));
            }
            return message.reply("✔ লিংক প্রটেকশন চালু হলো — এখন শুধু এডমিনরা লিংক দিতে পারবে।");
        }

        if (args[0] === "off") {
            data.allowedGroups = data.allowedGroups.filter(id => id !== event.threadID);
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
            return message.reply("❌ এই গ্রুপে লিংক প্রটেকশন বন্ধ করা হলো।");
        }
    },

    onChat: async function ({ api, event }) {
        const data = JSON.parse(fs.readFileSync(path));

        // অনুমোদিত গ্রুপ না হলে কিছুই করবে না
        if (!data.allowedGroups.includes(event.threadID)) return;

        const threadInfo = await api.getThreadInfo(event.threadID);

        // গ্রুপ এডমিন লিস্ট
        const adminList = threadInfo.adminIDs.map(a => a.id);

        const sender = event.senderID;

        // যদি সেন্ডার গ্রুপ এডমিন হয় → লিংক দিলে কিছুই হবে না
        if (adminList.includes(sender)) return;

        // যদি সেন্ডার বট নিজে হয় → স্কিপ
        if (sender == api.getCurrentUserID()) return;

        const msg = (event.body || "").toLowerCase();

        // লিংক শনাক্ত
        const linkPattern = /(https?:\/\/|www\.|\.com|\.net|\.org|facebook\.com|t\.me|telegram|whatsapp|chat\.whatsapp\.com)/;

        if (linkPattern.test(msg)) {
            const notice = 
`⚠️ সতর্কবার্তা!
 গ্রুপে কোন প্রকার লিংক দেওয়া যাবে না।

➡️ তাই নিয়ম ভঙ্গ করার জন্য আপনাকে গ্রুপ থেকে রিমুভ করা হচ্ছে।`;

            await api.sendMessage(notice, event.threadID);

            try {
                await api.removeUserFromGroup(sender, event.threadID);
            } catch (err) {
                api.sendMessage("❌ আমাকে এডমিন দিলে তবেই সদস্যকে রিমুভ করতে পারবো।", event.threadID);
            }
        }
    }
};
