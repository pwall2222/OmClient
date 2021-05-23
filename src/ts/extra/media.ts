import { errorHandler } from "ui/errorHandler.js";

const constrains = {
	video: true,
	audio: {
		echoCancellation: true,
		noiseSuppression: true,
	},
};

let media: Promise<MediaStream>;
const setMedia = () => {
	if (media) {
		return;
	}
	media = navigator.mediaDevices.getUserMedia(constrains);
	media.catch(errorHandler);
};

export { media, setMedia };
