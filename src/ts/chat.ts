import { cmd } from "./commands.js";
import { getLikeString, sendMessage } from "./frontFunctions.js";
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
			addStatus.typing();
		} else {
			document.querySelector(".typing")?.remove();
		}
	},
	clear() {
		clearChilds(".logbox");
	},
	scroll() {
		chatNode.logbox.scroll(0, chatNode.logbox.scrollHeight);
	},
	handleInput() {
		const chatContents = chatNode.typebox.value;
		if (chatContents[0] === "/") {
			cmd.handler(chatContents);
			chatNode.typebox.value = "";
		} else if (session.active && chatContents !== "") {
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
		tag: "div",
		child: {
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
		},
	});
};

const addStatus = {
	default(text: string) {
		createChildBefore(".logbox", ".typing", {
			tag: "p",
			args: {
				className: "statuslog",
				textContent: text,
			},
		});
		chatNode.scroll();
	},
	connected() {
		addStatus.default("You're now chatting with a random stranger.");
	},
	typing() {
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
	},
	likes(likes: string[]) {
		return addStatus.default(getLikeString(likes));
	},
};

chatNode.sendbtn.addEventListener("click", chatNode.handleInput);

export { chatNode };
export { addMessage, addStatus };
