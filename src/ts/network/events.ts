import { getLikeString } from "extra/frontFunctions.js";
import { session } from "index.js";
import { blockUnload } from "modules/functions.js";
import { settings } from "storage/settings.js";
import { addMessage, addStatus, chatNode, clearAdd } from "ui/chat.js";
import { disconnect, skip, userDisconect } from "ux/disconnect.js";
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
				const sessionBool = !session.video && session.connected;
				const settingBool = settings.autodisconnect && settings.video;
				const bool = settingBool && sessionBool;
				if (bool) {
					disconnect();
				}
			}, settings.autodisconnect_delay);
			clearAdd("You're now chatting with a random stranger.");
			if (settings.block_unload) {
				blockUnload();
			}
			session.connected = true;
			break;
		case "strangerDisconnected":
			userDisconect("Stranger");
			break;
		case "waiting":
			clearAdd("Waiting");
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
