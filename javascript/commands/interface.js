import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/storage/settings.js";
import * as chatNode from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.0/javascript/ui/chat/manager.js";
const cmd = {
    history: [],
    position: -1,
    current: "",
};
const next = () => {
    const newPosition = cmd.position + 1;
    if (cmd.position === -1) {
        cmd.current = chatNode.typebox.value;
    }
    changeVal(newPosition);
};
const previous = () => {
    const newPosition = cmd.position - 1;
    if (newPosition <= -1) {
        chatNode.typebox.value = cmd.current;
        cmd.position = -1;
        return;
    }
    changeVal(newPosition);
};
const changeVal = (newPosition) => {
    if (cmd.history.length <= newPosition) {
        return;
    }
    cmd.position = newPosition;
    chatNode.typebox.value = cmd.history[newPosition];
};
const handleHistory = (command) => {
    cmd.position = -1;
    addToHistory(command);
};
const addToHistory = (command) => {
    if (command === cmd.history[0]) {
        return;
    }
    cmd.history.unshift(command);
    cmd.history.splice(settings.cmd_history, 1);
    save();
};
const load = () => {
    const item = JSON.parse(localStorage.getItem("history"));
    if (Array.isArray(item)) {
        cmd.history = item;
    }
};
const save = () => {
    localStorage.setItem("history", JSON.stringify(cmd.history));
};
const clear = () => {
    cmd.history = [];
    save();
};
export { next, previous, handleHistory, load, clear, save };

//# sourceMappingURL=interface.js.map
