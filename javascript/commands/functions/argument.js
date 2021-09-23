import { sendMessage } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/extra/frontFunctions.js";
import { muteCam, muteMic } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/extra/media.js";
import { session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/index.js";
import { bindKey } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/keyboard/bindings.js";
import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/storage/settings.js";
import { addCommand } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/ui/chat/add.js";
import { setVolume } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/ui/nodes/video.js";
const likes = function () {
    settings.likes = this.list;
};
const social = function () {
    const arg = this.arguments[0];
    if (arg && settings.socials[arg] !== undefined) {
        sendMessage(`${arg}: ${settings.socials[arg]}`);
    }
};
const set = function () {
    const parsedArgs = JSON.parse(this.arguments[1]);
    const arg = this.arguments[0];
    if (typeof settings[arg] === typeof parsedArgs) {
        settings[arg] = parsedArgs;
        return;
    }
    addCommand("Type doesn't match or property doesn't exist.");
};
const send = function () {
    if (!session.connected) {
        return;
    }
    sendMessage(this.arguments.join(" "));
};
const volume = function () {
    const num = Number(this.arguments[0]);
    if (num >= 0 && num <= 100) {
        setVolume(num);
    }
};
const bind = function () {
    const args = this.arguments.join(" ");
    const command = args.replace(/%%/g, "&&");
    bindKey(command);
};
const mute = function () {
    const arg = this.arguments[0];
    if (arg == "cam") {
        muteCam();
        return;
    }
    if (arg == "mic") {
        muteMic();
        return;
    }
    muteCam();
    muteMic();
};
const binds = function () {
    const { bindings } = settings;
    switch (this.arguments[0]) {
        case "pop": {
            settings.bindings.pop();
            break;
        }
        case "shift": {
            settings.bindings.shift();
            break;
        }
        case "rm": {
            const count = +this.arguments[1];
            if (!count || count > bindings.length) {
                return;
            }
            bindings.splice(count - 1, 1);
            break;
        }
    }
};
export { set, social, send, volume, likes, bind, mute, binds };

//# sourceMappingURL=argument.js.map
