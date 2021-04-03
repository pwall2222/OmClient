const settings = {
	autoskip: false,
	autoskip_delay: 500,
	twiceskip: false,
	autodisconnect: false,
	autodisconnect_delay: 10000,
	autoclearchat: true,
	cmd_history: 25,
	likes: <string[]>[],
	likes_enabled: false,
	lang: "en",
	video: true,
	socials: {},
};

const settingManager = {
	load() {
		const item = JSON.parse(localStorage.getItem("settings"));
		for (const key in item) {
			settings[key] = item[key];
		}
	},
	save() {
		localStorage.setItem("settings", JSON.stringify(settings));
	},
	clear() {
		localStorage.removeItem("settings");
	},
};

export { settingManager, settings };
