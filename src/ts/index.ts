import { media } from "extra/video.js";
import { rateLimit, rateLimited } from "modules/ratelimit.js";
import { Backend } from "network/backend.js";
import { eventHandler } from "network/events.js";
import { createPC } from "network/webrtc.js";
import { Session } from "storage/session.js";
import { settingManager, settings } from "storage/settings.js";
import { chatNode, clearAdd } from "ui/chat.js";
import { errorHandler } from "ui/errorHandler.js";
import { disconnectNode, videoNode } from "ui/nodes.js";
import { cmd } from "ux/commands.js";
import { keyboard } from "ux/keyboard.js";

const newChat = async () => {
	if (rateLimited) {
		return;
	}
	rateLimit();

	session = new Session();
	session.started = true;

	disconnectNode.set("stop");

	clearAdd("Getting access to camera...");

	if (settings.autoclearchat) {
		chatNode.typebox.value = "";
	}

	videoNode.addSpinner();
	videoNode.addMedia(await media);

	createPC(await media);

	clearAdd("Conneting to server...");

	backend.newConnection();
};

const backend = new Backend({ eventHandler, errorHandler, settings });
let session = new Session();

cmd.load();
keyboard.init();
settingManager.load();

backend.serverFinder();

export { session, backend };
export { newChat };
