import { disconnect } from "./frontFunctions.js";
import { clearAllElements, createChild } from "./functions.js";
import { newChat, session } from "./index.js";

const disconnectNode = {
	txt: document.querySelector(".dscnttxt"),
	btn: document.querySelector(".dscntbtn"),
	set(text: disconnectStatus) {
		switch (text) {
			case "stop":
				disconnectNode.btn.className = "dscntbtn stop";
				disconnectNode.txt.textContent = "Stop";
				break;

			case "rlly":
				disconnectNode.btn.className = "dscntbtn rlly";
				disconnectNode.txt.textContent = "Really?";
				break;

			case "new":
				disconnectNode.btn.className = "dscntbtn new";
				disconnectNode.txt.textContent = "New";
				break;
		}
	},
	handler() {
		switch (disconnectNode.btn.classList[1]) {
			case "stop":
				disconnectNode.set("rlly");
				break;

			case "rlly":
				disconnectNode.set("new");
				disconnect();
				break;

			case "new":
				disconnectNode.set("stop");
				if (!session.connected) {
					newChat();
				}
				break;
		}
	},
};

const videoNode = {
	othervideo: document.querySelector<HTMLVideoElement>("#othervideo"),
	selfvideo: document.querySelector<HTMLVideoElement>("#selfvideo"),
	setVolume(volume: number) {
		videoNode.othervideo.volume = volume / 100;
	},
	playEvent() {
		session.video = true;
		clearAllElements(".spinner");
	},
	addSpinner() {
		createChild("#videowrapper", { tag: "div", args: { className: "spinner" } });
	},
};

videoNode.othervideo.addEventListener("play", videoNode.playEvent);

export { videoNode, disconnectNode };