import { session } from "index.js";
import { clearAllElements } from "modules/dom.js";
import * as chatNode from "ui/chat/manager.js";
import { addStatus } from "./chat/add.js";
import { newDC } from "./nodes/disconnect.js";

const errorHandler = (error: string | Error) => {
	chatNode.clear();
	if (typeof error == "string") {
		addStatus(error);
	} else {
		addStatus(error?.message);
	}
	newDC();
	session.started = false;
	clearAllElements(".spinner");
};

export { errorHandler };
