import { addStatus } from "./chat.js";
import { allowUnload, clearAllElements } from "./functions.js";
import { backend, session, newChat } from "./index.js";
import { disconnectNode, videoNode } from "./nodes.js";
import { settings } from "./settings.js";

const disconnect = (autoskip: boolean = true) => {
	backend.disconnect();
	userDisconect("You");
	if (autoskip) {
		execAutoskip();
	}
};

const userDisconect = (user: string) => {
	disconnectUI(user);
	disconnection();
	if (user !== "You") {
		execAutoskip();
	}
};

const disconnection = () => {
	if (!session.started) {
		return;
	}
	session.started = false;
	session.connected = false;
	disconnectVideo();
	allowUnload();
};

const skip = () => {
	if (session.started) {
		backend.disconnect();
		disconnectVideo();
	}
	newChat();
};

const execAutoskip = () => {
	if (!settings.autoskip) {
		return;
	}
	setTimeout(() => {
		if (!session.started) {
			newChat();
		}
	}, settings.autoskip_delay);
};

const disconnectUI = (user: string) => {
	document.querySelector(".typing")?.remove();
	disconnectNode.set("new");
	addStatus(`${user} Disconnected`);
};

const disconnectVideo = () => {
	if (!settings.video) {
		return;
	}
	clearAllElements(".spinner");
	videoNode.othervideo.srcObject = null;
};

export { userDisconect, skip, disconnect };
