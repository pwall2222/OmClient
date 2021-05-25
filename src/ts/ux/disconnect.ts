import { backend, newChat, session } from "index.js";
import { clearAllElements } from "modules/dom.js";
import { allowUnload } from "modules/functions.js";
import { rateLimited } from "modules/ratelimit.js";
import { settings } from "storage/settings.js";
import { addStatus } from "ui/chat/add.js";
import { newDC } from "ui/nodes/disconnect.js";
import { othervideo } from "ui/nodes/video.js";

const disconnect = (autoskip: boolean = true) => {
	if (!session.started) {
		return;
	}
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
	session.started = false;
	session.connected = false;
	disconnectVideo();
	allowUnload();
};

const skip = () => {
	if (session.started && !rateLimited) {
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
	newDC();
	addStatus(`${user} Disconnected`);
};

const disconnectVideo = () => {
	if (!settings.video) {
		return;
	}
	clearAllElements(".spinner");
	othervideo.srcObject = null;
};

export { userDisconect, skip, disconnect };
