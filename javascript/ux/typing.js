import { backend, session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/index.js";
import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/storage/settings.js";
import { typebox } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/ui/chat/manager.js";
let timeout = -1;
const typing = () => {
    if (session.typing) {
        return;
    }
    backend.sendIdentifiedPOST("typing");
    session.typing = true;
};
const stopTyping = () => {
    if (!session.typing) {
        return;
    }
    backend.sendIdentifiedPOST("stoppedtyping");
    session.typing = false;
};
const typingHanlder = () => {
    if (!session.connected || settings.silent_typing) {
        return;
    }
    if (typebox.value.trim() === "") {
        stopTyping();
        return;
    }
    clearTimeout(timeout);
    timeout = setTimeout(inputCheck, 5000, typebox.value);
    typing();
};
const inputCheck = (oldValue) => {
    if (typebox.value !== oldValue) {
        return;
    }
    stopTyping();
};
export { typingHanlder };

//# sourceMappingURL=typing.js.map
