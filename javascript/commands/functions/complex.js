import { commands } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/commands/list.js";
import { sendMessage } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/extra/frontFunctions.js";
import { newChat, session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/index.js";
import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/storage/settings.js";
import { addChild } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ui/chat/add.js";
import { text as enableText, video as enableVideo } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0/javascript/ui/modes.js";
const help = () => {
    const instructions = commands.reduce((val, element) => `${val}<b>${element.name}</b>:<br>${element.description}<br>`, "");
    addChild({
        tag: "p",
        args: {
            innerHTML: instructions,
            className: "command",
        },
    });
};
const theme = () => {
    const theme = settings.theme == "dark" ? "light" : "dark";
    settings.theme = theme;
    setTheme(theme);
};
const text = () => {
    if (session.started) {
        return;
    }
    settings.video = false;
    enableText();
    newChat();
};
const video = () => {
    if (session.started) {
        return;
    }
    settings.video = true;
    enableVideo();
    newChat();
};
const socials = () => {
    if (session.connected) {
        return;
    }
    let msg = "";
    for (const key in settings.socials) {
        msg += `${key}: ${settings.socials[key]}\n`;
    }
    sendMessage(msg);
};
export { help, theme, text, video, socials };

//# sourceMappingURL=complex.js.map
