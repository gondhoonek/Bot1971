const fs = require("fs");
const path = __dirname + "/linkKickSettings.json";

// সেটিংস ফাইল তৈরি যদি না থাকে
if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({ enabledThreads: [] }, null, 2));
}

module.exports = {
  config: {
    name: "linkkick",
    version: "1.0",
    author: "Auto",
    role: 0,
    description: "কোনো সদস্য যদি গ্রুপে লিংক দেয়, বড় নোটিশ দিয়ে রিমুভ করে দিবে। চালু/বন্ধ করার অপশন আছে।"
  },

  // ইভেন্ট হ্যান্ডলার
  handleEvent: async function({ api, event, Threads, Users }) {
    try {
      if (!event || !event.body) return;
      const threadID = event.threadID;
      const senderID = event.senderID;
      const message = event.body.trim();

      // URL/লিংক চেক (সাধারণ রেগেক্স)
      const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\S+\.(com|net|org|me|gg|io|xyz|info|biz|tv|online|site|club|co)\/?)/i;

      // --- GET BOT ID (মুমকিন হলে) ---
      let botID = null;
      try {
        if (typeof api.getCurrentUserID === "function") {
          botID = await api.getCurrentUserID();
        } else if (typeof api.getCurrentUser === "function") {
          const me = await api.getCurrentUser();
          botID = me && me.id;
        } else if (global && global.config && global.config.BOT_ID) {
          botID = global.config.BOT_ID;
        }
      } catch (e) {
        // ignore, botID may stay null
      }

      // --- লোড সেভ করা সেটিংস ---
      let settings = JSON.parse(fs.readFileSync(path));

      // --- কমান্ড: linkkick on / linkkick off ---
      const cmdMatch = message.match(/^(?:\/)?linkkick\s+(on|off)$/i);
      if (cmdMatch) {
        const mode = cmdMatch[1].toLowerCase(); // 'on' or 'off'

        // চেক: কমান্ড দিতে পারবে কে? গ্রুপ অ্যাডমিন বা বট অ্যাডমিন (যদি আলাদা তালিকা থাকে)
        let isAllowed = false;
        try {
          // প্রায় সব fb-like লাইব্রেরিতে getThreadInfo আছে
          const threadInfo = await new Promise((resolve) => {
            if (api.getThreadInfo.length === 2) {
              // callback style: (threadID, cb)
              api.getThreadInfo(threadID, (err, info) => resolve(info || {}));
            } else {
              // promise style
              api.getThreadInfo(threadID).then(info => resolve(info || {})).catch(()=>resolve({}));
            }
          });

          const adminIDs = (threadInfo && threadInfo.adminIDs) ? threadInfo.adminIDs.map(x => x.id || x) : [];
          // bot admin check (optional) - treat global.config.ADMINBOT as array if set
          const botAdmins = (global && global.config && global.config.ADMINBOT) ? global.config.ADMINBOT : [];

          if (adminIDs.includes(senderID) || botAdmins.includes(senderID)) isAllowed = true;
        } catch (e) {
          // যদি থ্রেড ইনফ না পাওয়া যায়, নিরাপদ ধারনা নেন যে থ্রেডে যারা এডমিন তা চেক করা যাচ্ছে না
          // নিরাপত্তার জন্য কমান্ডটি না অনুমোদন করাই ভাল
          isAllowed = false;
        }

        if (!isAllowed) {
          // অনুমতি নেই
          await api.sendMessage("আপনার অনুমতি নেই—কেবল গ্রুপ অ্যাডমিন বা বট অ্যাডমিন এ কমান্ড দিতে পারবে।", threadID);
          return;
        }

        if (mode === "on") {
          if (!settings.enabledThreads.includes(threadID)) settings.enabledThreads.push(threadID);
          fs.writeFileSync(path, JSON.stringify(settings, null, 2));
          await api.sendMessage("🔔 LinkKick এখন **চালু** করা হয়েছে এই গ্রুপে। কেউ লিংক দিলেই নোটিশ + রিমুভ হবে।", threadID);
        } else {
          settings.enabledThreads = settings.enabledThreads.filter(t => t != threadID);
          fs.writeFileSync(path, JSON.stringify(settings, null, 2));
          await api.sendMessage("🔕 LinkKick বন্ধ করা হয়েছে এই গ্রুপে।", threadID);
        }
        return;
      }

      // --- যদি এই থ্রেডে LinkKick অফ থাকে, কিছু না করো ---
      if (!settings.enabledThreads.includes(threadID)) return;

      // --- যদি মেসেজে লিংক না থাকে, কিছু না করো ---
      if (!urlRegex.test(message)) return;

      // --- যদি লিংক দেয়ায় পাঠানো ব্যক্তি বট হয়, কিছু না করো ---
      if (botID && senderID == botID) return;

      // --- EXCEPTION: গ্রুপ/বট অ্যাডমিনরা লিংক দিতে পারবে (আপনি চাইলে এই অংশ সরাতে পারেন) ---
      // এখানে আমরা গ্রুপ অ্যাডমিন হলে রিমুভ করবো না। (User চেয়েছিল 'বট নিজে link দিলে বাদ দেয়া হবে না' — তাই ডিফল্ট কেস শুধুমাত্র বটকে skip করা আছে)
      // যদি আপনি চান গ্রুপ অ্যাডমিনদেরও ছাড় দিতে, নিচের ব্লক আনকমেন্ট করুন।
      /*
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        const adminIDs = (threadInfo && threadInfo.adminIDs) ? threadInfo.adminIDs.map(a=>a.id || a) : [];
        if (adminIDs.includes(senderID)) return; // গ্রুপ এডমিন হলে বাদ দিবে না
      } catch(e) {}
      */

      // --- এখন: লিংক দিয়েছে একজন সদস্য (নোটিশ পাঠাও, তারপর রিমুভ) ---
      // বড় নোটিশ (বাংলায়). নাম mention করার চেষ্টা করা হয়েছে যদি লাইব্রেরি mentions সাপোর্ট করে।
      let userName = senderID;
      try {
        const userInfo = await Users.getData ? await Users.getData(senderID) : null;
        if (userInfo && (userInfo.name || userInfo.fullName)) userName = userInfo.name || userInfo.fullName;
      } catch (e) { /* ignore */ }

      const notice = `🚨 *সতর্কবার্তা* 🚨\n\n${userName} — আপনি গ্রুপে লিংক দিয়েছেন। গ্রুপের নিয়ম অনুযায়ী আপনাকে এখন থেকে গ্রুপ থেকে বহিষ্কার করা হবে।\n\n👉 ভবিষ্যতে এমনটি আর করবেন না।`;

      // Try sending mention if API supports it
      try {
        const mention = [{ id: senderID, tag: userName }];
        await api.sendMessage({ body: notice, mentions: mention }, threadID);
      } catch (e) {
        // fallback plain text
        await api.sendMessage(notice, threadID);
      }

      // Give a short delay (1000ms) যাতে মানুষ নোটিশ দেখে — (বিঃদ্রঃ synchronous/async নিয়ে প্রাইমারি নির্দেশনা অনুযায়ী এটি এখনই করা হচ্ছে)
      await new Promise(res => setTimeout(res, 1000));

      // Attempt to remove the user from thread — চেষ্টা করি দুইভাবে (method ভিন্ন হলে adjust করুন)
      try {
        if (typeof api.removeUserFromGroup === "function") {
          await api.removeUserFromGroup(threadID, senderID);
        } else if (typeof api.removeUser === "function") {
          await api.removeUser(senderID, threadID); // different arg order in some APIs
        } else if (typeof api.removeUserFromThread === "function") {
          await api.removeUserFromThread(senderID, threadID);
        } else {
          // যদি কোন কনভেনশন না মেলে, চেষ্টা করে কলব্যাক স্টাইলে
          if (api.removeUserFromGroup) {
            api.removeUserFromGroup(threadID, senderID, (err) => {});
          } else {
            // শেষ উপায়: গ্রুপে অ্যাডমিনদের জানাও (রিমুভ করতে ব্যর্থ হলে)
            await api.sendMessage("⚠️ ব্যবহারকারীকে প্রোগ্রাম্যাটিকালি রিমুভ করা সম্ভব হয়নি — দয়া করে গ্রুপ অ্যাডমিনেরা ম্যানুয়ালি রিমুভ করুন।", threadID);
          }
        }
      } catch (e) {
        // ব্যর্থ হলে জানিয়ে দাও
        await api.sendMessage("⚠️ রিমুভ করতে গিয়ে ত্রুটি হয়েছে — অনুগ্রহ করে গ্রুপ অ্যাডমিনরা ম্যানুয়ালি রিমুভ করুন।", threadID);
      }

    } catch (err) {
      // সাধারণ এরর হ্যান্ডেলিং
      console.error("LinkKick Error:", err);
    }
  }
};
