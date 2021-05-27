import { loadAll } from "extra/loader.js";
import { media, setMedia } from "extra/media.js";
import { connectionArgs } from "network/arguments.js";
import { Backend } from "network/backend.js";
import { eventHandler } from "network/events.js";
import { createPC } from "network/webrtc.js";
import { Session } from "storage/session.js";
import { settings } from "storage/settings.js";
import { clearAdd } from "ui/chat/add.js";
import { autoClearChat } from "ui/chat/manager.js";
import { errorHandler } from "ui/errorHandler.js";
import { setDC } from "ui/nodes/disconnect.js";
import { addMedia, addSpinner } from "ui/nodes/video.js";

const newChat = async () => {
	session = new Session();
	session.started = true;

	setDC("stop");

	autoClearChat();

	await videoChat();

	clearAdd("Conneting to server...");

	backend.newConnection();
};

const videoChat = async () => {
	if (!settings.video) {
		return;
	}

	clearAdd("Getting access to camera...");

	setMedia();

	addSpinner();
	addMedia(await media);

	createPC(await media);
};

const backend = new Backend({ eventHandler, errorHandler, connectionArgs });
let session = new Session();

loadAll();

export { session, backend };
export { newChat };
