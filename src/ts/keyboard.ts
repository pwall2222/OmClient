import { chatNode } from "./chat.js";
import { cmd } from "./commands.js";
import { skip, stopAutoskip } from "./frontFunctions.js";
import { session } from "./index.js";
import { disconnectNode } from "./nodes.js";

const keyboard = {
	init() {
		document.body.addEventListener("keydown", keyboard.handler);
	},
	handler(keyEvent: KeyboardEvent) {
		const target = keyEvent.target as HTMLElement;

		const events = [
			{
				key: "Enter",
				tag: "chatmsg",
				prevent: true,
				exec() {
					if (!keyEvent.shiftKey) {
						chatNode.handleInput();
					}
				},
			},
			{
				key: "ArrowUp",
				tag: "chatmsg",
				prevent: true,
				exec() {
					cmd.next();
				},
			},
			{
				key: "ArrowDown",
				tag: "chatmsg",
				prevent: true,
				exec() {
					cmd.previous();
				},
			},
			{
				key: "Escape",
				tag: "body",
				prevent: true,
				exec() {
					if (keyEvent.shiftKey && session.connected) {
						skip();
					} else if (keyEvent.ctrlKey) {
						stopAutoskip();
					} else {
						disconnectNode.handler();
					}
				},
			},
			{
				key: "Slash",
				tag: "body",
				prevent: false,
				exec() {
					if (chatNode.typebox.value === "") {
						chatNode.typebox.focus();
					}
				},
			},
			{
				key: "ContextMenu",
				tag: "body",
				prevent: true,
				exec() {
					skip();
				},
			},
		];

		const filter = (element: keyEvents) => element.key === keyEvent.code && (element.tag === target.className || element.tag === "body");
		const command = events.find(filter);
		if (command?.prevent) {
			keyEvent.preventDefault();
		}
		command?.exec();
	},
};

export { keyboard };
