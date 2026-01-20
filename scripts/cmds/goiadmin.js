module.exports = {
	config: {
		name: "goiadmin",
		author: "SaGor",
		role: 0,
		shortDescription: " ",
		longDescription: "",
		category: "BOT",
		guide: "{pn}"
	},

	onChat: function({ api, event }) {
		if (event.senderID !== "100029990749091","61575791445818","61579730351939","100088836995808","61581731642509") {
			var aid = ["100029990749091","61575791445818","61579730351939","100088836995808","61581731642509"];
			for (const id of aid) {
				if (Object.keys(event.mentions) == id) {
					var msg = [
						" প্রিন্স বস এখন খুব ব্যস্ত আছে।",
						" প্রিন্স বস এখন ফ্রি না, আমাকে বলুন কী দরকার?",
						" আমার স্যার এখন ব্যস্ত আছে।",
						" প্রিন্স স্যার এখন ব্যস্ত আছে গ্রুপে আসলে আপনার সাথে কথা বলবে।",
						" স্যার এখন ব্যস্ত আছে।",
						" একটু পরেই স্যার এ গ্রুপে আসবে অপেক্ষা করেন ",
						" বুঝতে পারলাম আপনার আমার প্রিন্স স্যার কে দরকার।",
						" বস এখন প্রচুর ব্যস্ত একটু ধৈর্য ধরুন",
						" বস লাইনে আসলেই আপনার সাথে কথা বলবে।",
						" বুঝতে পারছি আপনার খুব প্রয়োজন একটু ধৈর্য ধরেন।"
					];
					
					return api.sendMessage(
						{ body: msg[Math.floor(Math.random() * msg.length)] },
						event.threadID,
						event.messageID
					);
				}
			}
		}
	},

	onStart: async function({}) {}
};
