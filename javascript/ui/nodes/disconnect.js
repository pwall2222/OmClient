import { newChat, session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/index.js";
import { disconnect } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/ux/disconnect.js";
const dctxt = document.querySelector("#dscnttxt");
const dcbtn = document.querySelector("#dscntbtn");
const setDC = (className) => {
    const content = {
        new: "New",
        rlly: "Really?",
        stop: "Stop",
    };
    dcbtn.className = className;
    dctxt.textContent = content[className];
};
const dchandler = () => {
    switch (dcbtn.className) {
        case "stop":
            setDC("rlly");
            break;
        case "rlly":
            setDC("new");
            disconnect();
            break;
        case "new":
            setDC("stop");
            if (!session.started) {
                newChat();
            }
            break;
    }
};
export { setDC, dchandler, dcbtn };

//# sourceMappingURL=disconnect.js.map
