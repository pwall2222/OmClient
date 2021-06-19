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
	media.catch((error: Error) => {
		errorHandler(error);
		media = null;
	});
};

const releaseMedia = async () => {
	if (!media) {
		return;
	}
	const mediaData = await media;
	const tracks = mediaData.getTracks();
	tracks.forEach((track: MediaStreamTrack) => track.stop());
};

export { media, setMedia, releaseMedia };
