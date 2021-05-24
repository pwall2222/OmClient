import { session } from "index.js";
import { clearAllElements } from "modules/dom.js";
import * as chatNode from "./chat.js";
import { disconnectNode } from "./nodes.js";

const errorHandler = (error: string | Error) => {
	chatNode.clear();
	if (typeof error == "string") {
		chatNode.addStatus(error);
	} else {
		chatNode.addStatus(error?.message);
	}
	disconnectNode.set("new");
	session.started = false;
	clearAllElements(".spinner");
};

export { errorHandler };
