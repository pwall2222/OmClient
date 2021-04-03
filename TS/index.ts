import { Backend } from "./backend.js";
import { chatNode } from "./chat.js";
import { cmd } from "./commands.js";
import { eventHandler } from "./events.js";
import { createChild, clearAllElements } from "./functions.js";
import { keyboard } from "./keyboard.js";
import { videoNode, disconnectNode } from "./nodes.js";
import { session } from "./session.js";
import { settings, settingManager } from "./settings.js";
import { video } from "./webrtc.js";

const newChat = async function () {
	if (!session.current.server) {
		chatNode.add.status.default("No server could be fetched");
		return;
	}
	session.reset();
	session.current.connected = true;

	disconnectNode.set("stop");

	chatNode.clear();
	chatNode.add.status.default("Getting access to camera...");

	if (settings.autoclearchat) {
		chatNode.typebox.value = "";
	}

	createChild("#videowrapper", { tag: "div", args: { className: "spinner" } });

	try {
		const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true } });
		videoNode.selfvideo.srcObject ??= media;
		videoNode.selfvideo.muted = true;
		videoNode.othervideo.srcObject = null;

		session.current.pc = video(media);
	} catch (error) {
		chatNode.clear();
		if (window.RTCPeerConnection) {
			chatNode.add.status.default("Error getting to camera");
		} else {
			chatNode.add.status.default("WebRTC is disabled");
		}
		clearAllElements(".spinner");
		return;
	}

	chatNode.clear();
	chatNode.add.status.default("Conneting to server...");

	backend.newConnection();
};

const backend = new Backend(eventHandler, settings);
keyboard.init();
settingManager.load();
cmd.load();
backend.serverFinder();

export { session, backend };
export { newChat };
