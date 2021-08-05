import * as cmd from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/commands/interface.js";
import { session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/index.js";
import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/storage/settings.js";
import * as chatNode from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ui/chat/manager.js";
import { handleInput } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ui/chat/manager.js";
import { dchandler } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ui/nodes/disconnect.js";
import { disconnect, skip } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ux/disconnect.js";
const send = function () {
    if (this.shiftKey) {
        return;
    }
    handleInput();
};
const escape = function () {
    if (this.ctrlKey) {
        disconnect(false);
    }
    else if ((this.shiftKey && session.connected) || settings.skip_with_esc) {
        skip();
    }
    else {
        dchandler();
    }
};
const slash = () => {
    if (chatNode.typebox.value !== "") {
        return;
    }
    chatNode.typebox.focus();
};
const up = () => cmd.next();
const down = () => cmd.previous();
export { skip } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ux/disconnect.js";
export { send, escape, slash, up, down };

//# sourceMappingURL=functions.js.map
