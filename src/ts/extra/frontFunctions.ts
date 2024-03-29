import { backend, session } from "@/index.js";
import { addMessage } from "@/ui/chat/add.js";

const sendMessage = (msg: string) => {
	backend.sendIdentifiedPOST("send", { msg });
	addMessage(msg, "you");
	session.typing = false;
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

export { sendMessage, getLikeString };
