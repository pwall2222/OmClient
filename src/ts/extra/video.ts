import { errorHandler } from "ui/errorHandler.js";

const constrains = {
	video: true,
	audio: {
		echoCancellation: true,
		noiseSuppression: true,
	},
};
const media = navigator.mediaDevices.getUserMedia(constrains);
media.catch(errorHandler);

export { media };
