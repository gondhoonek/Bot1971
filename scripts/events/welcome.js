const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
        config: {
                name: "welcome",
                version: "2.0",
                author: "SaGor",
                category: "events"
        },

        langs: {
                vi: {
                        session1: "☀ 𝗦𝗮́𝗻𝗴",
                        session2: "⛅ 𝗧𝗿𝘂̛𝗮",
                        session3: "🌆 𝗖𝗵𝗶𝗲̂̀𝘂",
                        session4: "🌙 𝗧𝗼̂́𝗶",
                        welcomeMessage: "✨ 𝗖𝗮̉𝗺 𝗼̛𝗻 𝗯𝗮̣𝗻 𝗱𝗮̃ 𝗺𝗼̛̀𝗶 𝘁𝗼̂𝗶 𝘃𝗮̀𝗼 𝗻𝗵𝗼́𝗺!\n⚡ 𝗣𝗿𝗲𝗳𝗶𝘅 𝗯𝗼𝘁: %1\n🔎 Đ𝗲̂̉ 𝘅𝗲𝗺 𝗱𝗮𝗻𝗵 𝘀𝗮́𝗰𝗵 𝗹𝗲̣̂𝗻𝗵 𝗵𝗮̃𝘆 𝗻𝗵𝗮̣̂𝗽: %1help",
                        multiple1: "🔹 𝗕𝗮̣𝗻",
                        multiple2: "🔹 𝗖𝗮́𝗰 𝗯𝗮̣𝗻",
                        defaultWelcomeMessage: "🎉 𝗖𝗵𝗮̀𝗼 𝗺𝘂̛̀𝗻𝗴 {userName} 🎊\n\n🚀 𝗖𝗵𝗮̀𝗼 𝗺𝘂̛̀𝗻𝗴 𝗯𝗮̣𝗻 𝗱𝗲̂́𝗻 𝘃𝗼̛́𝗶 『 {boxName} 』\n🔹 𝗖𝗵𝘂́𝗰 𝗯𝗮̣𝗻 𝗰𝗼́ 𝗯𝘂𝗼̂̉𝗶 {session} 𝘃𝘂𝗶 𝘃𝗲̉! ✨"
                },
                en: {
                        session1: "☀ 𝐌𝐨𝐫𝐧𝐢𝐧𝐠",
                        session2: "⛅ 𝐍𝐨𝐨𝐧",
                        session3: "🌆 𝐀𝐟𝐭𝐞𝐫𝐧𝐨𝐨𝐧",
                        session4: "🌙 𝐄𝐯𝐞𝐧𝐢𝐧𝐠",
                        welcomeMessage: "🎉 『 𝗔𝗦𝗦𝗔𝗟𝗔𝗠𝗨 𝗔𝗟𝗔𝗜𝗞𝗨𝗠 』 🎉\n\n চলে এসেছে আমি প্রিন্স স্যার\n\n তোমাদের সাথে আড্ডা দেওয়ার জন্য চলে আসলাম\n তোমাদের জন্যই প্রিন্স স্যার আমাকে তৈরি করেছে\n\nসবাই ফ্রী টাইম ইসলাম প্রচার করবা",
                        multiple1: "🔹 𝖸𝗈𝗎",
                        multiple2: "🔹 𝖸𝗈𝗎 𝖦𝗎𝗒𝗌",
                        defaultWelcomeMessage: "🎉 『 𝗔𝗦𝗦𝗔𝗟𝗔𝗠𝗨 𝗔𝗟𝗔𝗜𝗞𝗨𝗠 』 🎉\n\n💠 প্রিয় মেম্বার\n {userName}!\n\n🔹 আপনাকে 『 {boxName} 』\n\n এর পক্ষ থেকে এবং আমার বস প্রিন্সের পক্ষ থেকে স্বাগতম {session} 🎊\n\n⚠ আমাকে নিয়ে কোন সমস্যা হলে অবশ্যই আমার বস প্রিন্সে জানাবেন তিনি যথাযথ ব্যবস্থা নিবেন🚀\n\n👤 যেই লোক আপনাকে এড করেছে:\n {adderName} \n\n গ্রুপের রুলস জন্য লিখুন👉𝗥𝘂𝗹𝗲𝘀👈\n\n এর নিয়মগুলো মানার জন্য বিশেষভাবে অনুরোধ করা হল❤️\n\n\n অনুরোধেঃ\n⭐𝗣𝗿𝗶𝗻𝗰𝗲 𝗕𝗹𝗮𝗰𝗸 𝗟𝗼𝘃𝗲𝗿⭐"
                }
        },

        onStart: async ({ threadsData, message, event, api, getLang }) => {
                if (event.logMessageType !== "log:subscribe") return;

                const { threadID, logMessageData } = event;
                const { addedParticipants } = logMessageData;
                const hours = getTime("HH");
                const prefix = global.utils.getPrefix(threadID);
                const nickNameBot = global.GoatBot.config.nickNameBot;

                if (addedParticipants.some(user => user.userFbId === api.getCurrentUserID())) {
                        if (nickNameBot) api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
                        return message.send(getLang("welcomeMessage", prefix));
                }

                if (!global.temp.welcomeEvent[threadID]) {
                        global.temp.welcomeEvent[threadID] = { joinTimeout: null, dataAddedParticipants: [] };
                }

                global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...addedParticipants);

                clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

                global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {
                        const threadData = await threadsData.get(threadID);
                        if (threadData.settings.sendWelcomeMessage === false) return;

                        const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                        const bannedUsers = threadData.data.banned_ban || [];
                        const threadName = threadData.threadName;

                        let newMembers = [], mentions = [];
                        let isMultiple = dataAddedParticipants.length > 1;

                        for (const user of dataAddedParticipants) {
                                if (bannedUsers.some(banned => banned.id === user.userFbId)) continue;
                                newMembers.push(user.fullName);
                                mentions.push({ tag: user.fullName, id: user.userFbId });
                        }

                        if (newMembers.length === 0) return;

                        // Get info of the adder
                        const adderID = event.author;
                        const adderInfo = await api.getUserInfo(adderID);
                        const adderName = adderInfo[adderID]?.name || "Someone";
                        mentions.push({ tag: adderName, id: adderID });

                        let welcomeMessage = threadData.data.welcomeMessage || getLang("defaultWelcomeMessage");

                        welcomeMessage = welcomeMessage
                                .replace(/\{userName\}|\{userNameTag\}/g, newMembers.join(", "))
                                .replace(/\{boxName\}|\{threadName\}/g, threadName)
                                .replace(/\{multiple\}/g, isMultiple ? getLang("multiple2") : getLang("multiple1"))
                                .replace(/\{session\}/g,
                                        hours <= 10 ? getLang("session1") :
                                        hours <= 12 ? getLang("session2") :
                                        hours <= 18 ? getLang("session3") : getLang("session4")
                                )
                                .replace(/\{adderName\}/g, adderName);

                        let form = {
                                body: welcomeMessage,
                                mentions: mentions
                        };

                        if (threadData.data.welcomeAttachment) {
                                const files = threadData.data.welcomeAttachment;
                                const attachments = files.map(file => drive.getFile(file, "stream"));

                                form.attachment = (await Promise.allSettled(attachments))
                                        .filter(({ status }) => status === "fulfilled")
                                        .map(({ value }) => value);
                        }

                        message.send(form);
                        delete global.temp.welcomeEvent[threadID];
                }, 1500);
        }
};
