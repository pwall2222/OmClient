import { Backend } from "./backend.js";
import { addStatus, chatNode } from "./chat.js";
import { cmd } from "./commands.js";
import { errorHandler } from "./errorHandler.js";
import { eventHandler } from "./events.js";
import { keyboard } from "./keyboard.js";
import { videoNode, disconnectNode } from "./nodes.js";
import { Session } from "./session.js";
import { settings, settingManager } from "./settings.js";
import { media } from "./video.js";
import { PeerConnection } from "./webrtc.js";

const newChat = async () => {
	session = new Session();
	session.started = true;

	disconnectNode.set("stop");

	chatNode.clear();
	addStatus.default("Getting access to camera...");

	if (settings.autoclearchat) {
		chatNode.typebox.value = "";
	}

	videoNode.addSpinner();
	videoNode.addMedia(media);

	try {
		session.pc = new PeerConnection();
		session.pc.addVideo(media);
	} catch (error) {
		errorHandler(error);
		return;
	}

	chatNode.clear();
	addStatus.default("Conneting to server...");

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
