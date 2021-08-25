import { backend, session } from "index.js";
import { typebox } from "ui/chat/manager.js";

let timeout = -1;

const typing = () => {
	if (session.typing) {
		return;
	}
	backend.sendIdentifiedPOST("typing");
	session.typing = true;
};

const stopTyping = () => {
	if (!session.typing) {
		return;
	}
	backend.sendIdentifiedPOST("stoppedtyping");
	session.typing = false;
};

const typingHanlder = () => {
	if (!session.connected) {
		return;
	}
	if (typebox.value.trim() === "") {
		stopTyping();
		return;
	}
	clearTimeout(timeout);
	timeout = setTimeout(inputCheck, 5000, typebox.value);
	typing();
};

const inputCheck = (oldValue: string) => {
	if (typebox.value !== oldValue) {
		return;
	}
	stopTyping();
};

export { typingHanlder };
