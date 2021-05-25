import { session } from "index.js";
import { clearAllElements, createChild } from "modules/dom.js";

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
	addMedia(media: MediaStream) {
		videoNode.selfvideo.srcObject ??= media;
	},
};
export { videoNode };
