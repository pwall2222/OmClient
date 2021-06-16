import * as functions from "./functions.js";

const events: keyEvents[] = [
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
		tag: "body",
		prevent: true,
		exec: functions.escape,
	},
	{
		key: "Slash",
		tag: "body",
		prevent: false,
		exec: functions.slash,
	},
	{
		key: "ControlRight",
		tag: "body",
		prevent: true,
		exec: functions.skip,
	},
];

export { events };
