import { addMessage, addStatus, chatNode } from "./chat.js";
import { disconnect, disconnectHandler, skip } from "./frontFunctions.js";
import { blockUnload } from "./functions.js";
import { session } from "./index.js";
import { videoNode } from "./nodes.js";
import { settings } from "./settings.js";
import { webRTC } from "./webrtc.js";

const history: string[] = [];

const eventHandler = async function (event: backendEvent) {
	switch (event.name) {
		case "rtccall":
		case "rtcpeerdescription":
		case "icecandidate":
			webRTC.eventHandler(event);
			break;
		case "gotMessage":
			chatNode.typing(false);
			addMessage(event.data, "stranger");
			break;
		case "typing":
			chatNode.typing(true);
			break;
		case "stoppedTyping":
			chatNode.typing(false);
			break;
		case "commonLikes":
			addStatus.likes(event.data);
			break;
		case "connected":
			setTimeout(() => {
				if (settings.video && !session.video && session.connected) {
					disconnect();
				}
			}, settings.autodisconnect_delay);
			chatNode.clear();
			addStatus.connected();
			if (settings.block_unload) {
				blockUnload();
			}
			session.connected = true;
			break;
		case "strangerDisconnected":
			videoNode.othervideo.srcObject = null;
			disconnectHandler("Stranger");
			break;
		case "waiting":
			chatNode.clear();
			addStatus.default("Waiting");
			break;
		case "identDigests":
			if (!history.some((id: string) => id == event.data)) {
				history.push(event.data);
			} else if (settings.twiceskip) {
				skip();
			}
			break;
		default:
			console.log(event);
			break;
	}
};

export { eventHandler };
