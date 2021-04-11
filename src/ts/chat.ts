import { cmd } from "./commands.js";
import { sendMessage } from "./frontFunctions.js";
import { createChildBefore, createChild, clearChilds } from "./functions.js";
import { session } from "./index.js";
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
			cmd.handler(chatContents);
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

chatNode.sendbtn.addEventListener("click", chatNode.handleInput);

export { chatNode };
export { addMessage, addStatus, addCustomStatus };
