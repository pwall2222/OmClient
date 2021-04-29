import { loadAll } from "extra/loader.js";
import { media } from "extra/video.js";
import { rateLimit, rateLimited } from "modules/ratelimit.js";
import { Backend } from "network/backend.js";
import { eventHandler } from "network/events.js";
import { createPC } from "network/webrtc.js";
import { Session } from "storage/session.js";
import { settings } from "storage/settings.js";
import { autoClear, clearAdd } from "ui/chat.js";
import { errorHandler } from "ui/errorHandler.js";
import { disconnectNode, videoNode } from "ui/nodes.js";

const newChat = async () => {
	if (rateLimited) {
		return;
	}
	rateLimit();

	session = new Session();
	session.started = true;

	disconnectNode.set("stop");

	clearAdd("Getting access to camera...");

	autoClear();

	videoNode.addSpinner();
	videoNode.addMedia(await media);

	createPC(await media);

	clearAdd("Conneting to server...");

	backend.newConnection();
};

const backend = new Backend({ eventHandler, errorHandler, settings });
let session = new Session();

loadAll();

export { session, backend };
export { newChat };
