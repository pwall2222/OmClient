import { createChildBefore } from "modules/dom.js";
import { clear } from "./manager.js";

const addMessage = (message: string, sender: messageAuthor) => {
	const pclass = `${sender}msg`;
	const user = sender === "you" ? "You" : "Stranger";
	createChildBefore(".logbox", ".typing", {
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
	scroll();
};

const addStatus = (text: string) => {
	createChildBefore(".logbox", ".typing", {
		tag: "p",
		args: {
			className: "statuslog",
			textContent: text,
		},
	});
	scroll();
};

const addCustomStatus = (domObject: domObject) => {
	createChildBefore(".logbox", ".typing", domObject);
	scroll();
};

const addCommand = (text: string) => {
	createChildBefore(".logbox", ".typing", {
		tag: "pre",
		args: {
			className: "command",
			textContent: text,
		},
	});
	scroll();
};

const clearAdd = (text: string) => {
	clear();
	addStatus(text);
};

export { addMessage, addStatus, addCustomStatus, addCommand, clearAdd };
