import { cmd } from "./commands.js";
import { sendMessage } from "./frontFunctions.js";
import { createChildBefore, createChild, clearChilds } from "./functions.js";
import { session } from "./index.js";
import { disconnectNode } from "./nodes.js";

const chatNode = {
	logbox: document.querySelector(".logbox"),
	typebox: document.querySelector<HTMLTextAreaElement>(".chatmsg"),
	sendbtn: document.querySelector<HTMLButtonElement>(".sendbtn"),
	add: {
		message(message: string, sender: messageAuthor) {
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
		},
		status: {
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
				chatNode.add.status.default("You're now chatting with a random stranger.");
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
				let display: string;
				if (likes.length < 0) {
					display = "Couldn't find a stranger with same interests.";
				} else if (likes.length === 1) {
					display = `You both like ${likes[0]}.`;
				} else if (likes.length > 1) {
					const last = likes.pop();
					const body = likes.join(", ");
					display = `You both like ${body} and ${last}.`;
				}
				chatNode.add.status.default(display);
			},
		},
	},
	typing(state: boolean) {
		session.typing = state;
		if (state) {
			chatNode.add.status.typing();
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

chatNode.sendbtn.addEventListener("click", chatNode.handleInput);

export { chatNode };
