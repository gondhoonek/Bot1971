const fs = require("fs");
const path = __dirname + "/linkKickData.json";

// ডাটা ফাইল না থাকলে তৈরি করো
if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({ allowedGroups: [], allowedUsers: [] }, null, 4));
}

module.exports = {
    config: {
        name: "linkkick",
        version: "2.0",
        author: "SaGor",
        role: 1,
        shortDescription: "নির্দিষ্ট আইডি ছাড়া কেউ লিংক দিতে পারবে না",
        longDescription: "Allowlist ছাড়া কেউ লিংক দিলে রিমুভ করবে",
        category: "group",
        guide: "{pn} on/off\n{pn} add <uid>\n{pn} remove <uid>"
    },

    // ON / OFF + ADD / REMOVE COMMAND
    onStart: async function ({ message, event, args }) {
        const data = JSON.parse(fs.readFileSync(path));
        const cmd = args[0];

        if (!cmd) {
            return message.reply(
`Usage:
linkkick on/off
linkkick add <uid>
linkkick remove <uid>`);
        }

        // ON
        if (cmd === "on") {
            if (!data.allowedGroups.includes(event.threadID)) {
                data.allowedGroups.push(event.threadID);
                fs.writeFileSync(path, JSON.stringify(data, null, 4));
            }
            return message.reply("✅ লিংক প্রটেকশন চালু\n(শুধুমাত্র allowlist আইডি লিংক দিতে পারবে)");
        }

        // OFF
        if (cmd === "off") {
            data.allowedGroups = data.allowedGroups.filter(id => id !== event.threadID);
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
            return message.reply("❌ লিংক প্রটেকশন বন্ধ");
        }

        // ADD user ID
        if (cmd === "add") {
            const uid = args[1];
            if (!uid) return message.reply("⚠️ একটি UID দিন।");

            if (!data.allowedUsers.includes(uid)) {
                data.allowedUsers.push(uid);
                fs.writeFileSync(path, JSON.stringify(data, null, 4));
            }
            return message.reply(`✅ UID ${uid} allowList-এ যোগ করা হলো`);
        }

        // REMOVE user ID
        if (cmd === "remove") {
            const uid = args[1];
            if (!uid) return message.reply("⚠️ একটি UID দিন।");

            data.allowedUsers = data.allowedUsers.filter(id => id !== uid);
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
            return message.reply(`❌ UID ${uid} allowList থেকে সরানো হলো`);
        }
    },

    // চ্যাট মনিটর
    onChat: async function ({ api, event }) {
        const data = JSON.parse(fs.readFileSync(path));

        // গ্রুপ on না থাকলে কাজ করবে না
        if (!data.allowedGroups.includes(event.threadID)) return;

        const msg = event.body?.toLowerCase() || "";
        if (!msg) return;

        const threadInfo = await api.getThreadInfo(event.threadID);
        const botID = api.getCurrentUserID();
        const sender = event.senderID;

        // বট এডমিন না হলে কিছু করবে না
        if (!threadInfo.adminIDs.some(ad => ad.id == botID)) return;

        // লিংক ধরার রেগেক্স
        const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|\b[a-z0-9\-]+\.(com|net|org|info|xyz|co|io)\b)/gi;
        if (!linkRegex.test(msg)) return;

        // ❗ allowed users skip
        if (data.allowedUsers.includes(sender)) return;

        // ❗ বট skip
        if (sender == botID) return;

        // নোটিশ
        const notice =
`⚠️ সতর্কবার্তা!

এই গ্রুপে শুধুমাত্র নির্দিষ্ট UID-রা লিংক দিতে পারবে।
আপনি allowList-এ নেই, তাই আপনাকে রিমুভ করা হচ্ছে।`;

        await api.sendMessage(notice, event.threadID);

        // রিমুভ
        try {
            await api.removeUserFromGroup(sender, event.threadID);
        } catch (err) {
            await api.sendMessage("❌ রিমুভ করতে পারলাম না, আমাকে এডমিন দিন।", event.threadID);
        }
    }
};
