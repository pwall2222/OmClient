import { newChat, session } from "index.js";
import { disconnect } from "ux/disconnect.js";

const dctxt = document.querySelector("#dscnttxt");
const dcbtn = document.querySelector("#dscntbtn");

const setDC = (className: "new" | "rlly" | "stop") => {
	const content = {
		new: "New",
		rlly: "Really?",
		stop: "Stop",
	};
	dcbtn.className = className;
	dctxt.textContent = content[className];
};

const dchandler = () => {
	switch (dcbtn.className) {
		case "stop":
			setDC("rlly");
			break;

		case "rlly":
			setDC("new");
			disconnect();
			break;

		case "new":
			setDC("stop");
			if (!session.started) {
				newChat();
			}
			break;
	}
};

export { setDC, dchandler, dcbtn };
