import { chatNode, addStatus } from "./chat.js";
import { clearAllElements } from "./functions.js";
import { session } from "./index.js";
import { disconnectNode } from "./nodes.js";

const errorHandler = (error: any) => {
	chatNode.clear();
	if (typeof error == "string") {
		addStatus.default(error);
	} else {
		addStatus.default(error?.message);
	}
	disconnectNode.set("new");
	session.started = false;
	clearAllElements(".spinner");
};

export { errorHandler };
