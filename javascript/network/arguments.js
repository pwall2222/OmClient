import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/storage/settings.js";
const connectionArgs = () => {
    const { video, likes, lang } = settings;
    const arg = {
        caps: "t",
        webrtc: true,
        firstevents: false,
        lang: lang,
        topics: likes,
    };
    if (!settings.likes_enabled) {
        delete arg.topics;
    }
    if (!video) {
        delete arg.webrtc;
    }
    return arg;
};
export { connectionArgs };

//# sourceMappingURL=arguments.js.map
