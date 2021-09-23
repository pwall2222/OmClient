import { commandHandler } from "commands/handler.js";
import { sendMessage } from "extra/frontFunctions.js";
import { session } from "index.js";
import { clearChilds } from "modules/dom.js";
import { settings } from "storage/settings.js";
import { setDC } from "ui/nodes/disconnect.js";
import { addChild } from "./add.js";

const logbox = document.querySelector("#logbox");

const logwrapper = document.querySelector("#logwrapper");

const typebox = document.querySelector<HTMLTextAreaElement>("#chatmsg");

const sendbtn = document.querySelector<HTMLButtonElement>("#sendbtn");

const clear = () => clearChilds("#logbox");

const scroll = () => logwrapper.scrollTo({ top: logwrapper.scrollHeight });

const autoClearChat = () => {
	if (!settings.autoclearchat) {
		return;
	}
	typebox.value = "";
};

const setTyping = (state: boolean) => {
	session.typing = state;
	if (!state) {
		document.querySelector(".typing")?.remove();
		return;
	}
	addChild({
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
};

const handleInput = () => {
	const chatContents = typebox.value;
	if (chatContents[0] === "/") {
		commandHandler(chatContents);
		typebox.value = "";
		return;
	}
	if (!session.connected || chatContents === "") {
		return;
	}
	sendMessage(typebox.value);
	typebox.value = "";
	setDC("stop");
};

export { logbox, typebox, sendbtn };
export { clear, scroll, setTyping, autoClearChat, handleInput };
