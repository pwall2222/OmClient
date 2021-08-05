import * as functions from "./functions.js";
const events = [
    {
        key: "Enter",
        tag: "chatmsg",
        prevent: true,
        exec: functions.send,
    },
    {
        key: "ArrowUp",
        tag: "chatmsg",
        prevent: true,
        exec: functions.up,
    },
    {
        key: "ArrowDown",
        tag: "chatmsg",
        prevent: true,
        exec: functions.down,
    },
    {
        key: "Escape",
        global: true,
        prevent: true,
        exec: functions.escape,
    },
    {
        key: "Slash",
        global: true,
        prevent: false,
        exec: functions.slash,
    },
    {
        key: "ControlRight",
        global: true,
        prevent: true,
        exec: functions.skip,
    },
];
export { events };

//# sourceMappingURL=list.js.map
