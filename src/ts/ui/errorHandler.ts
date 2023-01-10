import { session } from "@/index.js";
import { clearAllElements } from "@/modules/dom.js";
import { clearAdd } from "./chat/add.js";
import { setDC } from "./nodes/disconnect.js";

const errorHandler = (error: string | Error) => {
	const message = errorData(error);
	clearAdd(message);
	setDC("new");
	session.started = false;
	clearAllElements(".spinner");
};

const errorData = (error: string | Error) => {
	const rawInfo = error["name"] ?? error;
	const data = {
		NotAllowedError: "Camera blocked. Please enable it and try again.",
		NoServer: "The server status couldn't be fetched, retry or check your connection.",
		TypeError: "Connection error, retry or check your internet.",
	};
	const description = data[rawInfo] ?? error;
	return description;
};

export { errorHandler };
