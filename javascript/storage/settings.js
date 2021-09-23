const settings = {
    autoskip: false,
    autoskip_delay: 500,
    block_unload: false,
    twiceskip: false,
    skip_with_esc: false,
    autodisconnect: false,
    autodisconnect_delay: 10000,
    autoclearchat: true,
    silent_typing: false,
    cmd_history: 25,
    likes: [],
    likes_enabled: false,
    lang: "en",
    theme: "light",
    video: true,
    socials: {},
    bindings: [],
};
const settingManager = {
    load() {
        const item = JSON.parse(localStorage.getItem("settings"));
        if (item == null) {
            return;
        }
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

//# sourceMappingURL=settings.js.map
