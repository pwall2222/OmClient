import { newChat, session } from "index.js";
import { disconnect } from "ux/disconnect.js";

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
				if (!session.started) {
					newChat();
				}
				break;
		}
	},
};

export { disconnectNode };
