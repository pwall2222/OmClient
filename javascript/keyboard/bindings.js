import { commandHandler } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/commands/handler.js";
import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/storage/settings.js";
import { typebox } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/ui/chat/manager.js";
import { events } from "./list.js";
const recordKeyPromise = (resolve) => {
    const handleEvent = (keyEvent) => {
        const { altKey, ctrlKey, shiftKey, code } = keyEvent;
        const mode = getMode({ ctrlKey, altKey, shiftKey });
        const filterEvents = ({ key }) => key === code;
        const filterBinds = (binding) => binding.code == code && binding.mode == mode;
        const filters = events.some(filterEvents) || settings.bindings.some(filterBinds);
        if (filters) {
            return;
        }
        resolve({ code, mode });
        document.removeEventListener("keydown", handleEvent);
    };
    document.addEventListener("keydown", handleEvent);
};
const recordKey = () => new Promise(recordKeyPromise);
const getMode = (num) => +num.ctrlKey * 100 + +num.altKey * 10 + +num.shiftKey;
const bindKey = async (command) => {
    typebox.blur();
    const key = await recordKey();
    const binding = { ...key, command };
    settings.bindings.push(binding);
};
const getCommand = (keyEvent) => {
    const codeFilter = (binding) => {
        const keyBool = binding.code === keyEvent.code;
        const { altKey, ctrlKey, shiftKey } = keyEvent;
        const mode = getMode({ ctrlKey, altKey, shiftKey });
        return keyBool && mode == binding.mode;
    };
    const command = settings.bindings.find(codeFilter);
    return command;
};
const bindingHandler = (keyEvent) => {
    const bind = getCommand(keyEvent);
    if (!bind) {
        return;
    }
    keyEvent.preventDefault();
    commandHandler("/" + bind.command);
};
export { bindKey, bindingHandler };

//# sourceMappingURL=bindings.js.map
