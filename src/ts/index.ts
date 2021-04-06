import { Backend } from "./backend.js";
import { addStatus, chatNode } from "./chat.js";
import { cmd } from "./commands.js";
import { errorHandler } from "./errorHandler.js";
import { eventHandler } from "./events.js";
import { keyboard } from "./keyboard.js";
import { videoNode, disconnectNode } from "./nodes.js";
import { Session } from "./session.js";
import { settings, settingManager } from "./settings.js";
import { PeerConnection } from "./webrtc.js";

const newChat = async function () {
	session = new Session();
	session.started = true;

	disconnectNode.set("stop");

	chatNode.clear();
	addStatus.default("Getting access to camera...");

	if (settings.autoclearchat) {
		chatNode.typebox.value = "";
	}

	videoNode.addSpinner();

	try {
		const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true } });
		videoNode.selfvideo.srcObject ??= media;

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

const backend = new Backend(eventHandler, settings);
let session = new Session();

cmd.load();
keyboard.init();
settingManager.load();

backend.serverFinder();

export { session, backend };
export { newChat };
