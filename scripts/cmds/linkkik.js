module.exports = {
    config: {
        name: "linkkick",
        version: "1.0",
        author: "SaGor",
        description: "Automatically remove users who post links except bot/admin",
        category: "group"
    },

    onMessage: async function ({ api, event, threadsData, Users }) {

        // শুধুমাত্র নির্দিষ্ট গ্রুপে কাজ করবে
        const allowedGroupIDs = ["2806419096235925"]; // এখানে আপনার গ্রুপ আইডি দিন
        if (!allowedGroupIDs.includes(event.threadID)) return;

        // গ্রুপের এডমিন লিস্ট
        const adminIDs = await threadsData.get(event.threadID, "adminIDs");

        const botID = api.getCurrentUserID();

        // মেসেজে লিংক আছে কিনা চেক
        const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
        if (!linkRegex.test(event.body)) return;

        // যদি মেসেজ পাঠানো হয় বট অথবা বটের এডমিন দ্বারা → কিছু হবে না
        if (event.senderID === botID || adminIDs.includes(event.senderID)) return;

        // নোটিশ পাঠানো
        const noticeMessage = `⚠️ বড় সতর্কবার্তা!\nআপনি গ্রুপে লিংক দিয়েছেন, তাই আপনাকে রিমুভ করা হলো।`;
        await api.sendMessage(noticeMessage, event.threadID);

        // ব্যবহারকারীকে রিমুভ করা
        try {
            await api.removeUserFromGroup(event.senderID, event.threadID);
        } catch (err) {
            console.log("Failed to remove user:", err);
        }
    }
};
