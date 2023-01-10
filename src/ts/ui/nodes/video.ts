import { session } from "@/index.js";
import { clearAllElements, createChild } from "@/modules/dom.js";

const othervideo = document.querySelector<HTMLVideoElement>("#othervideo");

const selfvideo = document.querySelector<HTMLVideoElement>("#selfvideo");

const setVolume = (volume: number) => {
	othervideo.volume = volume / 100;
};

const playEvent = () => {
	session.video = true;
	clearAllElements(".spinner");
};

const addSpinner = () => {
	createChild("#videowrapper", { tag: "div", args: { className: "spinner" } });
};

const addMedia = (media: MediaStream) => {
	selfvideo.srcObject ??= media;
};

export { othervideo, selfvideo };
export { setVolume, playEvent, addSpinner, addMedia };
