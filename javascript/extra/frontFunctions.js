import { backend } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.1/javascript/index.js";
import { addMessage } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.1/javascript/ui/chat/add.js";
const sendMessage = (msg) => {
	backend.sendIdentifiedPOST("send", { msg });
	addMessage(msg, "you");
};
const getLikeString = (likes) => {
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

//# sourceMappingURL=frontFunctions.js.map
