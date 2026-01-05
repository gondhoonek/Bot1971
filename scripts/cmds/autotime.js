const moment = require("moment-timezone");

module.exports.config = {
  name: "autoprayertime",
  version: "1.0",
  author: "Mohammad Akash | Enhanced by Grok",
  role: 0,
  description: "নামাজের সময় হলে স্বয়ংক্রিয়ভাবে সব গ্রুপে রিমাইন্ডার পাঠাবে",
  category: "AutoTime"
};

// ঢাকার নামাজের সময়সূচি (প্রতিদিনের জন্য আনুমানিক, ২০২৫-২০২৬ সালের গড়)
const prayerTimes = {
  fajr: "05:22",    // ফজর
  dhuhr: "01:30",   // যোহর
  asr: "03:50",     // আসর
  maghrib: "05:26", // মাগরিব (সূর্যাস্তের সাথে পরিবর্তনশীল)
  isha: "08:30"     // ইশা
};

const prayerNames = {
  fajr: "ফজর",
  dhuhr: "যোহর",
  asr: "আসর",
  maghrib: "মাগরিব",
  isha: "ইশা"
};

module.exports.onLoad = async function ({ api }) {
  setTimeout(() => {
    console.log("🕌 Auto Prayer Time Reminder চালু হয়েছে...");

    const checkAndSend = async () => {
      const now = moment().tz("Asia/Dhaka");
      const currentTime = now.format("HH:mm");
      const date = now.format("DD-MM-YYYY");
      const time12 = now.format("hh:mm A");

      let prayerName = null;
      let prayerKey = null;

      // প্রতিটি নামাজের সময়ের সাথে মিলিয়ে দেখা (±২ মিনিটের মধ্যে)
      for (const [key, time] of Object.entries(prayerTimes)) {
        const prayerMoment = moment(time, "HH:mm");
        const diff = Math.abs(now.diff(now.clone().hour(prayerMoment.hour()).minute(prayerMoment.minute()), 'minutes'));

        if (diff <= 2) { // ২ মিনিটের মধ্যে হলে ট্রিগার
          prayerName = prayerNames[key];
          prayerKey = key;
          break;
        }
      }

      if (prayerName) {
        // আজকে এই নামাজের জন্য ইতিমধ্যে মেসেজ পাঠানো হয়েছে কিনা চেক (ডুপ্লিকেট প্রতিরোধ)
        const today = now.format("YYYY-MM-DD");
        if (global.sentPrayers?.[today]?.[prayerKey]) return;

        // রেকর্ড রাখা
        if (!global.sentPrayers) global.sentPrayers = {};
        if (!global.sentPrayers[today]) global.sentPrayers[today] = {};
        global.sentPrayers[today][prayerKey] = true;

        const message = 
`🕌 আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ 🕌

╭──────────────╮
📢 এখন ${prayerName} এর সময়   │
╰──────────────╯

🕋 আসুন আমরা সবাই নামাজ আদায় করি  
আল্লাহ আমাদের সবাইকে নামাজ কবুল করুন 🤲

🕒 সময়: ${time12}
📅 তারিখ: ${date}

🕌 আত-তাকওয়া ফাউন্ডেশন 🕌
━━━━━━━━━━━━━━━━━━━━━━`;

        try {
          const threads = await api.getThreadList(100, null, ["INBOX"]);
          const groups = threads.filter(t => t.isGroup);

          console.log(`🕌 ${prayerName} এর সময় – ${groups.length}টি গ্রুপে মেসেজ পাঠানো হচ্ছে...`);

          for (const group of groups) {
            await api.sendMessage(message, group.threadID);
            await new Promise(resolve => setTimeout(resolve, 1000)); // রেট লিমিট এড়ানো
          }

        } catch (error) {
          console.error("❌ নামাজের রিমাইন্ডার পাঠাতে সমস্যা:", error);
        }
      }
    };

    // প্রতি ১ মিনিটে চেক করা (যথেষ্ট নিরাপদ ও কার্যকর)
    setInterval(checkAndSend, 60 * 1000);

    // লোড হওয়ার সাথে সাথে একবার চেক (যদি ঠিক সময়ে রিস্টার্ট হয়)
    checkAndSend();

  }, 5000);
};

module.exports.onStart = () => {};
