import { addMessage, addStatus, chatNode } from "./chat.js";
import { clearAllElements } from "./functions.js";
import { backend, newChat, session } from "./index.js";
import { videoNode, disconnectNode } from "./nodes.js";
import { settings } from "./settings.js";

const disconnect = () => {
	backend.disconnect();
	videoNode.othervideo.srcObject = null;
	disconnectHandler("You");
};

const stopAutoskip = () => {
	const temp = settings.autoskip;
	settings.autoskip = false;
	disconnect();
	settings.autoskip = temp;
};

const skip = () => {
	backend.disconnect();
	clearAllElements(".spinner");
	newChat();
};

const disconnectHandler = (user: string) => {
	if (session.active) {
		addStatus.default(`${user} Disconnected`);
		disconnectNode.set("new");
		session.active = false;
		session.connected = false;
		document.querySelector(".typing")?.remove();
	}
	if (settings.autoskip) {
		setTimeout(() => {
			if (!session.connected) {
				newChat();
			}
		}, settings.autoskip_delay);
	}
	clearAllElements(".spinner");
};

const sendMessage = (msg: string) => {
	backend.sendIdentifiedPOST("send", { msg });
	addMessage(msg, "you");
};

export { disconnect, skip, stopAutoskip, disconnectHandler, sendMessage };
