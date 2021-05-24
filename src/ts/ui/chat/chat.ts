import { commandHandler } from "commands/handler.js";
import { sendMessage } from "extra/frontFunctions.js";
import { session } from "index.js";
import { clearChilds, createChild, createChildBefore } from "modules/dom.js";
import { settings } from "storage/settings.js";
import { disconnectNode } from "ui/nodes.js";

const logbox = document.querySelector(".logbox");

const typebox = document.querySelector<HTMLTextAreaElement>(".chatmsg");

const sendbtn = document.querySelector<HTMLButtonElement>(".sendbtn");

const setTyping = (state: boolean) => {
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
		scroll();
	} else {
		document.querySelector(".typing")?.remove();
	}
};

const clear = () => clearChilds(".logbox");

const scroll = () => logbox.lastElementChild.scrollIntoView();

const handleInput = () => {
	const chatContents = typebox.value;
	if (chatContents[0] === "/") {
		commandHandler(chatContents);
		typebox.value = "";
	} else if (session.connected && chatContents !== "") {
		sendMessage(typebox.value);
		typebox.value = "";
		disconnectNode.set("stop");
	}
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

const autoClearChat = () => {
	if (settings.autoclearchat) {
		typebox.value = "";
	}
};

export { logbox, typebox, sendbtn };
export { setTyping, clear, scroll, handleInput };
export { addMessage, addStatus, addCustomStatus, addCommand, clearAdd, autoClearChat };
