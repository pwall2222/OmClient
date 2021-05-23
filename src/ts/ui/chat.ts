import { commandHandler } from "commands/handler.js";
import { sendMessage } from "extra/frontFunctions.js";
import { session } from "index.js";
import { clearChilds, createChild, createChildBefore } from "modules/dom.js";
import { settings } from "storage/settings.js";
import { disconnectNode } from "./nodes.js";

const chatNode = {
	logbox: document.querySelector(".logbox"),
	typebox: document.querySelector<HTMLTextAreaElement>(".chatmsg"),
	sendbtn: document.querySelector<HTMLButtonElement>(".sendbtn"),
	typing(state: boolean) {
		session.typing = state;
		if (state) {
			createChild(".logbox", {
				tag: "div",
				args: {
					className: "logitem typing",
				},
				child: {
					tag: "p",
					args: {
						className: "statuslog",
						innerText: "Stranger is typing...",
					},
				},
			});
			chatNode.scroll();
		} else {
			document.querySelector(".typing")?.remove();
		}
	},
	clear() {
		clearChilds(".logbox");
	},
	scroll() {
		chatNode.logbox.lastElementChild.scrollIntoView();
	},
	handleInput() {
		const chatContents = chatNode.typebox.value;
		if (chatContents[0] === "/") {
			commandHandler(chatContents);
			chatNode.typebox.value = "";
		} else if (session.connected && chatContents !== "") {
			sendMessage(chatNode.typebox.value);
			chatNode.typebox.value = "";
			disconnectNode.set("stop");
		}
	},
};

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
	chatNode.scroll();
};

const addStatus = (text: string) => {
	createChildBefore(".logbox", ".typing", {
		tag: "p",
		args: {
			className: "statuslog",
			textContent: text,
		},
	});
	chatNode.scroll();
};

const addCustomStatus = (domObject: domObject) => {
	createChildBefore(".logbox", ".typing", domObject);
	chatNode.scroll();
};

const addCommand = (text: string) => {
	createChildBefore(".logbox", ".typing", {
		tag: "pre",
		args: {
			className: "command",
			textContent: text,
		},
	});
	chatNode.scroll();
};

const clearAdd = (text: string) => {
	chatNode.clear();
	addStatus(text);
};

const autoClearChat = () => {
	if (settings.autoclearchat) {
		chatNode.typebox.value = "";
	}
};

export { chatNode };
export { addMessage, addStatus, addCustomStatus, addCommand, clearAdd, autoClearChat };
