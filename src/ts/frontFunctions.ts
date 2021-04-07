import { addMessage, addStatus } from "./chat.js";
import { allowUnload, clearAllElements } from "./functions.js";
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
	videoNode.othervideo.srcObject = null;
	clearAllElements(".spinner");
	newChat();
};

const disconnectHandler = (user: string) => {
	if (session.connected) {
		allowUnload();
		addStatus.default(`${user} Disconnected`);
		disconnectNode.set("new");
		session.connected = false;
		session.started = false;
		document.querySelector(".typing")?.remove();
	}
	if (settings.autoskip) {
		setTimeout(() => {
			if (!session.started) {
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

const getLikeString = (likes: string[]) => {
	if (likes.length < 0) {
		return "Couldn't find a stranger with same interests.";
	}

	if (likes.length === 1) {
		return `You both like ${likes[0]}.`;
	}

	if (likes.length > 1) {
		const last = likes.pop();
		const body = likes.join(", ");
		return `You both like ${body} and ${last}.`;
	}
};

export { disconnect, skip, stopAutoskip, disconnectHandler, sendMessage, getLikeString };
