import { Backend } from "./backend.js";
import { chatNode, clearAdd } from "./chat.js";
import { cmd } from "./commands.js";
import { errorHandler } from "./errorHandler.js";
import { eventHandler } from "./events.js";
import { keyboard } from "./keyboard.js";
import { disconnectNode, videoNode } from "./nodes.js";
import { rateLimit, rateLimited } from "./ratelimit.js";
import { Session } from "./session.js";
import { settingManager, settings } from "./settings.js";
import { media } from "./video.js";
import { PeerConnection } from "./webrtc.js";

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

	try {
		session.pc = new PeerConnection();
		session.pc.addVideo(await media);
	} catch (error) {
		errorHandler(error);
		return;
	}

	clearAdd("Conneting to server...");

	backend.newConnection().catch(errorHandler);
};

const backend = new Backend({ eventHandler, errorHandler, settings });
let session = new Session();

cmd.load();
keyboard.init();
settingManager.load();

backend.serverFinder();

export { session, backend };
export { newChat };
