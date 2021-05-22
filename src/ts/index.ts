import { loadAll } from "extra/loader.js";
import { media } from "extra/media.js";
import { rateLimit, rateLimited } from "modules/ratelimit.js";
import { connectionArgs } from "network/arguments.js";
import { Backend } from "network/backend.js";
import { eventHandler } from "network/events.js";
import { createPC } from "network/webrtc.js";
import { Session } from "storage/session.js";
import { autoClearChat, clearAdd } from "ui/chat.js";
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

	autoClearChat();

	clearAdd("Getting access to camera...");

	videoNode.addSpinner();
	videoNode.addMedia(await media);

	createPC(await media);

	clearAdd("Conneting to server...");

	backend.newConnection();
};

const backend = new Backend({ eventHandler, errorHandler, connectionArgs });
let session = new Session();

loadAll();

export { session, backend };
export { newChat };
