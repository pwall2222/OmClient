import { commandHandler } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/commands/handler.js";
import { sendMessage } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/extra/frontFunctions.js";
import { session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/index.js";
import { clearChilds } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/modules/dom.js";
import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/storage/settings.js";
import { setDC } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/ui/nodes/disconnect.js";
import { addChild } from "./add.js";
const logbox = document.querySelector("#logbox");
const logwrapper = document.querySelector("#logwrapper");
const typebox = document.querySelector("#chatmsg");
const sendbtn = document.querySelector("#sendbtn");
const clear = () => clearChilds("#logbox");
const scroll = () => logwrapper.scrollTo({ top: logwrapper.scrollHeight });
const autoClearChat = () => {
    if (!settings.autoclearchat) {
        return;
    }
    typebox.value = "";
};
const setTyping = (state) => {
    session.typing = state;
    if (!state) {
        document.querySelector(".typing")?.remove();
        return;
    }
    addChild({
        tag: "div",
        args: {
            className: "logitem typing",
        },
        child: {
            tag: "p",
            args: {
                className: "statuslog",
                innerText: "Stranger is typing...",
            },
        },
    });
};
const handleInput = () => {
    const chatContents = typebox.value;
    if (chatContents[0] === "/") {
        commandHandler(chatContents);
        typebox.value = "";
        return;
    }
    if (!session.connected || chatContents === "") {
        return;
    }
    sendMessage(typebox.value);
    typebox.value = "";
    setDC("stop");
};
export { logbox, typebox, sendbtn };
export { clear, scroll, setTyping, autoClearChat, handleInput };

//# sourceMappingURL=manager.js.map
