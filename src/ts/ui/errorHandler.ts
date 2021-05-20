import { session } from "index.js";
import { clearAllElements } from "modules/dom.js";
import { addStatus, chatNode } from "./chat.js";
import { disconnectNode } from "./nodes.js";

const errorHandler = (error: string | Error) => {
	chatNode.clear();
	if (typeof error == "string") {
		addStatus(error);
	} else {
		addStatus(error?.message);
	}
	disconnectNode.set("new");
	session.started = false;
	clearAllElements(".spinner");
};

export { errorHandler };
