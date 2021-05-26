const loadMode = () => {
	const mode = JSON.parse(localStorage.getItem("settings"))?.video;
	if (mode == null || mode) {
		return;
	}

	const flexTape = document.querySelector<HTMLElement>("#flex-tape");
	const chatBox = document.querySelector("#chatbox");

	flexTape.style.display = "none";
	document.body.appendChild(chatBox);
};

loadMode();
