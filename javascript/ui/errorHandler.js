import { session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/index.js";
import { clearAllElements } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/modules/dom.js";
import { clearAdd } from "./chat/add.js";
import { setDC } from "./nodes/disconnect.js";
const errorHandler = (error) => {
    const message = errorData(error);
    clearAdd(message);
    setDC("new");
    session.started = false;
    clearAllElements(".spinner");
};
const errorData = (error) => {
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

//# sourceMappingURL=errorHandler.js.map
