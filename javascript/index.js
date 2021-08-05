import { loadAll } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/extra/loader.js";
import { media, setMedia } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/extra/media.js";
import { connectionArgs } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/network/arguments.js";
import { Backend } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/network/backend.js";
import { eventHandler } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/network/events.js";
import { createPC } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/network/webrtc.js";
import { Session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/storage/session.js";
import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/storage/settings.js";
import { clearAdd } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ui/chat/add.js";
import { autoClearChat } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ui/chat/manager.js";
import { errorHandler } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ui/errorHandler.js";
import { setDC } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ui/nodes/disconnect.js";
import { addMedia, addSpinner } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ui/nodes/video.js";
const newChat = async () => {
    session = new Session();
    session.started = true;
    setDC("stop");
    autoClearChat();
    await videoChat();
    clearAdd("Conneting to server...");
    backend.newConnection();
};
const videoChat = async () => {
    if (!settings.video) {
        return;
    }
    clearAdd("Getting access to camera...");
    setMedia();
    addSpinner();
    addMedia(await media);
    createPC(await media);
};
const backend = new Backend({ eventHandler, errorHandler, connectionArgs });
let session = new Session();
loadAll();
export { session, backend };
export { newChat };

//# sourceMappingURL=index.js.map
