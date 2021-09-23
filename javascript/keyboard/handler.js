import { events } from "./list.js";
const getCommand = (keyEvent) => {
    const codeFilter = ({ key }) => key === keyEvent.code;
    const command = events.find(codeFilter);
    if (!command) {
        return;
    }
    if (command["global"]) {
        return command;
    }
    const targetElement = keyEvent.target;
    const target = targetElement.id || targetElement.tagName.toLowerCase();
    if (command["tag"] === target) {
        return command;
    }
};
const keyboardHandler = (keyEvent) => {
    const command = getCommand(keyEvent);
    if (!command) {
        return;
    }
    if (command.prevent) {
        keyEvent.preventDefault();
    }
    command.exec.apply(keyEvent);
};
export { keyboardHandler };

//# sourceMappingURL=handler.js.map
