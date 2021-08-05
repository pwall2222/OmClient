import { createChildBefore } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.1/javascript/modules/dom.js";
import { clear, scroll } from "./manager.js";
const addChild = (domObject) => {
	createChildBefore("#logbox", ".typing", domObject);
	scroll();
};
const addMessage = (message, sender) => {
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
const addStatus = (text) => {
	addChild({
		tag: "p",
		args: {
			className: "statuslog",
			textContent: text,
		},
	});
};
const addCommand = (text) => {
	addChild({
		tag: "pre",
		args: {
			className: "command",
			textContent: text,
		},
	});
};
const clearAdd = (text) => {
	clear();
	addStatus(text);
};
export { addMessage, addStatus, addChild, addCommand, clearAdd };

//# sourceMappingURL=add.js.map
