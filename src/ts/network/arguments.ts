import { settings } from "storage/settings.js";

const connectionArgs = () => {
	const { video, likes, lang } = settings;
	const arg = {
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
