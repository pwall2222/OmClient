import { chatNode } from "./chat.js";
import { clearAllElements } from "./functions.js";
import { backend, newChat, session } from "./index.js";
import { videoNode, disconnectNode } from "./nodes.js";
import { settings } from "./settings.js";

const disconnect = () => {
	backend.disconnect();
	videoNode.othervideo.srcObject = null;
	disconnectHandler("You");
};

const skip = () => {
	backend.disconnect();
	clearAllElements(".spinner");
	newChat();
};

const stopAutoskip = () => {
	const temp = settings.autoskip;
	settings.autoskip = false;
	disconnect();
	settings.autoskip = temp;
};

const disconnectHandler = (user: string) => {
	if (session.current.active) {
		chatNode.add.status.default(`${user} Disconnected`);
		disconnectNode.set("new");
		session.current.active = false;
		session.current.connected = false;
		document.querySelector(".typing")?.remove();
	}
	if (settings.autoskip) {
		setTimeout(() => {
			if (!session.current.connected) {
				newChat();
			}
		}, settings.autoskip_delay);
	}
	clearAllElements(".spinner");
};

export { disconnect, skip, stopAutoskip, disconnectHandler };
