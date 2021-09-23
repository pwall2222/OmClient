import { backend, newChat, session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/index.js";
import { clearAllElements } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/modules/dom.js";
import { allowUnload } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/modules/functions.js";
import { rateLimit, rateLimited } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/modules/ratelimit.js";
import { deletePC } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/network/webrtc.js";
import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/storage/settings.js";
import { addStatus } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/ui/chat/add.js";
import { setDC } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/ui/nodes/disconnect.js";
import { othervideo } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/ui/nodes/video.js";
const disconnect = (autoskip = true) => {
    if (!session.started) {
        return;
    }
    backend.disconnect();
    userDisconect("You");
    if (autoskip) {
        execAutoskip();
    }
};
const userDisconect = (user) => {
    disconnectUI(user);
    disconnection();
    if (user !== "You") {
        execAutoskip();
    }
};
const disconnection = () => {
    session.started = false;
    session.connected = false;
    disconnectVideo();
    allowUnload();
};
const skip = () => {
    if (rateLimited) {
        return;
    }
    rateLimit();
    skipUI();
    newChat();
};
const execAutoskip = () => {
    if (!settings.autoskip) {
        return;
    }
    setTimeout(() => {
        if (session.started) {
            return;
        }
        newChat();
    }, settings.autoskip_delay);
};
const disconnectUI = (user) => {
    document.querySelector(".typing")?.remove();
    setDC("new");
    addStatus(`${user} Disconnected`);
};
const skipUI = () => {
    if (!session.started) {
        return;
    }
    backend.disconnect();
    disconnectVideo();
};
const disconnectVideo = () => {
    if (!settings.video) {
        return;
    }
    clearAllElements(".spinner");
    othervideo.srcObject = null;
    deletePC();
};
export { userDisconect, skip, disconnect };

//# sourceMappingURL=disconnect.js.map
