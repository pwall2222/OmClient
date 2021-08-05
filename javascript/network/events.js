import { getLikeString } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/extra/frontFunctions.js";
import { session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/index.js";
import { blockUnload } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/modules/functions.js";
import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/storage/settings.js";
import { addMessage, addStatus, clearAdd } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/ui/chat/add.js";
import { setTyping } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/ui/chat/manager.js";
import { disconnect, userDisconect } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/ux/disconnect.js";
import { twiceSkipping } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/ux/twiceSkip.js";
import { eventHandlerRTC } from "./webrtc.js";
const eventHandler = (event) => {
    const { name, data } = event;
    if (!session.started) {
        return;
    }
    switch (name) {
        case "rtccall":
        case "rtcpeerdescription":
        case "icecandidate":
            eventHandlerRTC(event);
            break;
        case "gotMessage":
            setTyping(false);
            addMessage(data, "stranger");
            break;
        case "typing":
            setTyping(true);
            break;
        case "stoppedTyping":
            setTyping(false);
            break;
        case "commonLikes":
            addStatus(getLikeString(data));
            break;
        case "connected":
            connected();
            break;
        case "strangerDisconnected":
            userDisconect("Stranger");
            break;
        case "nullRequest":
            if (session.connected) {
                userDisconect("Stranger");
            }
            break;
        case "waiting":
            clearAdd("Waiting");
            break;
        case "identDigests":
            return twiceSkipping(data);
        case "serverMessage":
            addStatus(data);
            break;
        case "error":
            if (data.includes("banned")) {
                settings.autoskip = false;
            }
            console.log(event);
            break;
        default:
            console.log(event);
            break;
    }
};
const connected = () => {
    setTimeout(() => {
        const sessionBool = !session.video && session.connected;
        const settingBool = settings.autodisconnect && settings.video;
        if (settingBool && sessionBool) {
            disconnect();
        }
    }, settings.autodisconnect_delay);
    clearAdd("You're now chatting with a random stranger.");
    if (settings.block_unload) {
        blockUnload();
    }
    session.connected = true;
};
export { eventHandler };

//# sourceMappingURL=events.js.map
