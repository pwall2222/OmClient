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

const changeMic = async (id: string) => {
	(await media).getAudioTracks()[0].stop();
	const nConstrains = {
		video: true,
		audio: {
			echoCancellation: true,
			noiseSuppression: true,
			deviceId: { exact: id },
		},
	};
	media = navigator.mediaDevices.getUserMedia(nConstrains);
	return media;
};

const muteAny = (track: MediaStreamTrack) => (track.enabled = !track.enabled);

const muteMic = async () => {
	const mediaObj = await media;
	mediaObj.getAudioTracks().forEach(muteAny);
};

const muteCam = async () => {
	const mediaObj = await media;
	mediaObj.getVideoTracks().forEach(muteAny);
};

export { media, setMedia, releaseMedia, muteCam, muteMic, changeMic };
