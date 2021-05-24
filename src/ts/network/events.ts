import { getLikeString } from "extra/frontFunctions.js";
import { session } from "index.js";
import { blockUnload } from "modules/functions.js";
import { settings } from "storage/settings.js";
import { addMessage, addStatus, clearAdd } from "ui/chat/add.js";
import { setTyping } from "ui/chat/manager.js";
import { disconnect, userDisconect } from "ux/disconnect.js";
import { twiceSkipping } from "ux/twiceSkip.js";
import { eventHandlerRTC } from "./webrtc.js";

const eventHandler = (event: backendEvent) => {
	const { name, data } = event;
	if (!session.started) {
		return;
	}
	switch (name) {
		case "rtccall":
		case "rtcpeerdescription":
		case "icecandidate":
			eventHandlerRTC(event);
			break;
		case "gotMessage":
			setTyping(false);
			addMessage(data, "stranger");
			break;
		case "typing":
			setTyping(true);
			break;
		case "stoppedTyping":
			setTyping(false);
			break;
		case "commonLikes":
			addStatus(getLikeString(data));
			break;
		case "connected":
			setTimeout(() => {
				const sessionBool = !session.video && session.connected;
				const settingBool = settings.autodisconnect && settings.video;
				if (settingBool && sessionBool) {
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
			return twiceSkipping(data);
		case "serverMessage":
			addStatus(data);
			break;
		case "error":
			if (data.includes("banned")) {
				settings.autoskip = false;
			}
			console.log(event);
			break;
		default:
			console.log(event);
			break;
	}
};

export { eventHandler };
