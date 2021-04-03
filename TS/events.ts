import { chatNode } from "./chat.js";
import { disconnect, disconnectHandler, skip } from "./frontFunctions.js";
import { session } from "./index.js";
import { videoNode } from "./nodes.js";
import { settings } from "./settings.js";
import { webRTC } from "./webrtc.js";

const eventHandler = async function (event: backendEvent) {
	switch (event.name) {
		case "rtccall":
		case "rtcpeerdescription":
		case "icecandidate":
			webRTC.eventHandler(event);
			break;
		case "gotMessage":
			chatNode.typing(false);
			chatNode.add.message(event.data, "stranger");
			break;
		case "typing":
			chatNode.typing(true);
			break;
		case "stoppedTyping":
			chatNode.typing(false);
			break;
		case "commonLikes":
			chatNode.add.status.likes(event.data);
			break;
		case "connected":
			setTimeout(() => {
				if (settings.video && !session.current.video && session.current.active) {
					disconnect();
				}
			}, settings.autodisconnect_delay);
			chatNode.clear();
			chatNode.add.status.connected();
			session.current.active = true;
			break;
		case "strangerDisconnected":
			videoNode.othervideo.srcObject = null;
			disconnectHandler("Stranger");
			break;
		case "waiting":
			chatNode.clear();
			chatNode.add.status.default("Waiting");
			break;
		case "identDigests":
			if (!session.history.some((id: string) => id == event.data)) {
				session.history.push(event.data);
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
