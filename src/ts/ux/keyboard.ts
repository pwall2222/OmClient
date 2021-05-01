import { session } from "index.js";
import { settings } from "storage/settings.js";
import { chatNode } from "ui/chat.js";
import { disconnectNode } from "ui/nodes.js";
import { cmd } from "./commands.js";
import { disconnect, skip } from "./disconnect.js";

const keyboardHandler = (keyEvent: KeyboardEvent) => {
	const target = keyEvent.target as HTMLElement;

	const events: keyEvents[] = [
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
				if ((keyEvent.shiftKey && session.connected) || settings.skip_with_esc) {
					skip();
				} else if (keyEvent.ctrlKey) {
					disconnect(false);
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
			key: "ControlRight",
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
};

export { keyboardHandler };
