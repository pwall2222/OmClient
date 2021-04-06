import { chatNode, addStatus } from "./chat.js";
import { clearAllElements } from "./functions.js";
import { session } from "./index.js";
import { disconnectNode } from "./nodes.js";

const errorHandler = (error: unknown) => {
	chatNode.clear();
	if (typeof error == "string") {
		addStatus.default(error);
	} else if (window.RTCPeerConnection) {
		addStatus.default("Error getting to camera");
	} else {
		addStatus.default("WebRTC is disabled");
	}
	disconnectNode.set("new");
	session.connected = false;
	clearAllElements(".spinner");
};

export { errorHandler };
