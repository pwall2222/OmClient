import { createChildBefore } from "modules/dom.js";
import { clear } from "./manager.js";

const addChild = (domObject: domObject) => {
	createChildBefore("#logbox", ".typing", domObject);
	scroll();
};

const addMessage = (message: string, sender: messageAuthor) => {
	const pclass = `${sender}msg`;
	const user = sender === "you" ? "You" : "Stranger";
	addChild({
		tag: "p",
		args: {
			className: pclass,
			innerHTML: `<strong class="msgsource">${user}: </strong>`,
		},
		child: {
			tag: "span",
			args: {
				textContent: message,
			},
		},
	});
};

const addStatus = (text: string) => {
	addChild({
		tag: "p",
		args: {
			className: "statuslog",
			textContent: text,
		},
	});
};

const addCommand = (text: string) => {
	addChild({
		tag: "pre",
		args: {
			className: "command",
			textContent: text,
		},
	});
};

const clearAdd = (text: string) => {
	clear();
	addStatus(text);
};

export { addMessage, addStatus, addChild, addCommand, clearAdd };
