import { releaseMedia } from "extra/media.js";

const flexTape = document.querySelector<HTMLElement>("#flex-tape");
const chat = document.querySelector<HTMLElement>(".chat");
const chatBox = document.querySelector("#chatbox");
const body = document.body;

const text = () => {
	flexTape.style.display = "none";
	body.appendChild(chatBox);
	releaseMedia();
};

const video = () => {
	flexTape.style.display = "flex";
	chat.appendChild(chatBox);
};

export { text, video };
