import { chatNode } from "./chat.js";
import { cmd } from "./commands.js";
import { skip, stopAutoskip } from "./frontFunctions.js";
import { disconnectNode } from "./nodes.js";
import { session } from "./session.js";
import { settings } from "./settings.js";

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
				exec() {
					if (!keyEvent.shiftKey) {
						keyEvent.preventDefault();
						chatNode.handleInput();
					}
				},
			},
			{
				key: "ArrowUp",
				tag: "chatmsg",
				exec() {
					keyEvent.preventDefault();
					cmd.next();
				},
			},
			{
				key: "ArrowDown",
				tag: "chatmsg",
				exec() {
					keyEvent.preventDefault();
					cmd.previous();
				},
			},
			{
				key: "Escape",
				tag: "body",
				exec() {
					keyEvent.preventDefault();
					if (keyEvent.shiftKey && session.current.active) {
						skip();
					} else if (keyEvent.ctrlKey && settings.autoskip) {
						stopAutoskip();
					} else {
						disconnectNode.handler();
					}
				},
			},
			{
				key: "Slash",
				tag: "body",
				exec() {
					if (chatNode.typebox.value === "") {
						chatNode.typebox.focus();
					}
				},
			},
			{
				key: "ContextMenu",
				tag: "body",
				exec() {
					keyEvent.preventDefault();
					skip();
				},
			},
		];

		const filter = (element: keyEvents) => element.key === keyEvent.code && (element.tag === target.className || element.tag === "body");
		events.find(filter)?.exec();
	},
};

export { keyboard };
