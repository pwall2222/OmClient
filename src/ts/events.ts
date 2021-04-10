import { addMessage, addStatus, chatNode } from "./chat.js";
import { disconnect, skip, userDisconect } from "./disconnect.js";
import { getLikeString } from "./frontFunctions.js";
import { blockUnload } from "./functions.js";
import { session } from "./index.js";
import { settings } from "./settings.js";
import { webRTC } from "./webrtc.js";

const history: string[] = [];

const eventHandler = (event: backendEvent) => {
	if (!session.started) {
		return;
	}
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
			addStatus(getLikeString(event.data));
			break;
		case "connected":
			setTimeout(() => {
				const bool = settings.autodisconnect && settings.video && !session.video && session.connected;
				if (bool) {
					disconnect();
				}
			}, settings.autodisconnect_delay);
			chatNode.clear();
			addStatus("You're now chatting with a random stranger.");
			if (settings.block_unload) {
				blockUnload();
			}
			session.connected = true;
			break;
		case "strangerDisconnected":
			userDisconect("Stranger");
			break;
		case "waiting":
			chatNode.clear();
			addStatus("Waiting");
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
