import { newChat, session } from "index.js";
import { disconnect } from "ux/disconnect.js";

const dctxt = document.querySelector(".dscnttxt");
const dcbtn = document.querySelector(".dscntbtn");

const stopDC = () => {
	dcbtn.className = "dscntbtn stop";
	dctxt.textContent = "Stop";
};

const rllyDC = () => {
	dcbtn.className = "dscntbtn rlly";
	dctxt.textContent = "Really?";
};

const newDC = () => {
	dcbtn.className = "dscntbtn new";
	dctxt.textContent = "New";
};

const dchandler = () => {
	switch (dcbtn.classList[1]) {
		case "stop":
			rllyDC();
			break;

		case "rlly":
			newDC();
			disconnect();
			break;

		case "new":
			stopDC();
			if (!session.started) {
				newChat();
			}
			break;
	}
};

export { dchandler, dcbtn };
export { newDC, rllyDC, stopDC };
