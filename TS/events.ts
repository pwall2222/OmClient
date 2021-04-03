import { chatNode } from "./chat.js";
import { disconnect, disconnectHandler, skip } from "./frontFunctions.js";
import { setFirstByIndex } from "./functions.js";
import { session, backend } from "./index.js";
import { videoNode } from "./nodes.js";
import { settings } from "./settings.js";
import { webRTC } from "./webrtc.js";

const eventHandler = {
	executer: async function (event: backendEvent) {
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
	},
	parser(events: object[]) {
		eventHandler.putIdentityFirst(events);
		for (const element of events) {
			const event = {
				name: element[0],
				data: element[1],
			};
			eventHandler.executer(event);
		}
	},
	async subscribe() {
		const response = await backend.sendIdentifiedPOST("events");
		switch (response.status) {
			case 200:
				const events = await response.json();
				if (events != null && session.current.connected) {
					eventHandler.parser(events);
					await eventHandler.subscribe();
				}
				break;

			case 502:
				await eventHandler.subscribe();
				break;

			case 400:
				console.log("Server barked:" + response.statusText);
				break;

			default:
				console.log("Server barked:" + response.statusText);
				await backend.server();
				break;
		}
	},
	putIdentityFirst(events: object[]) {
		const index = events.findIndex((element: string[]) => element[0] == "identDigests");
		setFirstByIndex(events, index);
	},
};

export { eventHandler };
