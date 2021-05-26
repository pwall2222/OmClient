import { commandHandler } from "commands/handler.js";
import { sendMessage } from "extra/frontFunctions.js";
import { session } from "index.js";
import { clearChilds, createChild } from "modules/dom.js";
import { settings } from "storage/settings.js";
import { setDC } from "ui/nodes/disconnect.js";

const logbox = document.querySelector("#logbox");

const typebox = document.querySelector<HTMLTextAreaElement>("#chatmsg");

const sendbtn = document.querySelector<HTMLButtonElement>("#sendbtn");

const clear = () => clearChilds("#logbox");

const scroll = () => logbox.lastElementChild.scrollIntoView();

const autoClearChat = () => {
	if (settings.autoclearchat) {
		typebox.value = "";
	}
};

const setTyping = (state: boolean) => {
	session.typing = state;
	if (state) {
		createChild("#logbox", {
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

const handleInput = () => {
	const chatContents = typebox.value;
	if (chatContents[0] === "/") {
		commandHandler(chatContents);
		typebox.value = "";
	} else if (session.connected && chatContents !== "") {
		sendMessage(typebox.value);
		typebox.value = "";
		setDC("stop");
	}
};

export { logbox, typebox, sendbtn };
export { clear, scroll, setTyping, autoClearChat, handleInput };
