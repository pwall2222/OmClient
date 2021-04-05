import { Backend } from "./backend.js";
import { addStatus, chatNode } from "./chat.js";
import { cmd } from "./commands.js";
import { eventHandler } from "./events.js";
import { clearAllElements } from "./functions.js";
import { keyboard } from "./keyboard.js";
import { videoNode, disconnectNode } from "./nodes.js";
import { Session } from "./session.js";
import { settings, settingManager } from "./settings.js";
import { Video } from "./webrtc.js";

const newChat = async function () {
	session = new Session();
	session.connected = true;

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
		videoNode.othervideo.srcObject = null;

		session.pc = new Video();
		session.pc.addVideo(media);
	} catch (error) {
		chatNode.clear();
		if (window.RTCPeerConnection) {
			addStatus.default("Error getting to camera");
		} else {
			addStatus.default("WebRTC is disabled");
		}
		clearAllElements(".spinner");
		return;
	}

	chatNode.clear();
	addStatus.default("Conneting to server...");

	backend.newConnection();
};

const backend = new Backend(eventHandler, settings);
let session = new Session();

cmd.load();
keyboard.init();
settingManager.load();

backend.serverFinder();

export { session, backend };
export { newChat };
