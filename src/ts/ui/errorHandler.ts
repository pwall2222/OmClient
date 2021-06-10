import { session } from "index.js";
import { clearAllElements } from "modules/dom.js";
import { clearAdd } from "./chat/add.js";
import { setDC } from "./nodes/disconnect.js";

const errorHandler = (error: string | Error) => {
	const message = error["message"] ?? error;
	clearAdd(message);
	setDC("new");
	session.started = false;
	clearAllElements(".spinner");
};

export { errorHandler };
