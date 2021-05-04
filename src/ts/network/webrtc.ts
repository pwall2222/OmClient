import { backend, session } from "index.js";
import { clearArray } from "modules/array.js";
import { settings } from "storage/settings.js";
import { videoNode } from "ui/nodes.js";

const WEB = {
	config: {
		iceServers: [
			{
				urls: "stun:stun.l.google.com:19302",
			},
			{
				urls: "stun:stun.services.mozilla.com",
			},
		],
	},
	constrains: {
		offerToReceiveAudio: true,
		offerToReceiveVideo: true,
	},
};

class PeerConnection extends RTCPeerConnection {
	constructor() {
		super(WEB.config);

		this.onicecandidate = async (event: RTCPeerConnectionIceEvent) => {
			if (this.iceGatheringState !== "complete") {
				await backend.sendIdentifiedPOST("icecandidate", { candidate: event.candidate });
				clearArray(session.rtc.candidates);
			}
		};

		this.ontrack = (event: RTCTrackEvent) => {
			videoNode.othervideo.srcObject = event.streams[0];
		};
	}

	addVideo(media: MediaStream) {
		media.getTracks().forEach((track: MediaStreamTrack) => {
			this.addTrack(track, media);
		});
	}
}

const webRTC = {
	async eventHandler(event: backendEvent) {
		const { pc, rtc } = session;
		switch (event.name) {
			case "rtccall":
				rtc.call = true;
				this.descriptionHandler("Offer");
				break;
			case "rtcpeerdescription":
				const answer = new RTCSessionDescription(event.data);
				await pc.setRemoteDescription(answer);
				rtc.peer = true;
				for (let i = 0; i < rtc.candidates.length; i++) {
					const signal = rtc.candidates[i];
					await pc.addIceCandidate(new RTCIceCandidate(signal));
				}
				rtc.candidates.splice(0, rtc.candidates.length);
				if (!rtc.call) {
					this.descriptionHandler("Answer");
				}
				break;
			case "icecandidate":
				if (!rtc.peer) {
					rtc.candidates.push(event.data);
				} else {
					pc.addIceCandidate(new RTCIceCandidate(event.data));
				}
				break;
		}
	},
	async descriptionHandler(option: descriptionOption) {
		const videoSession = await session.pc[`create${option}`](WEB.constrains);
		await session.pc.setLocalDescription(videoSession);
		backend.sendIdentifiedPOST("rtcpeerdescription", { desc: videoSession });
	},
};

const createPC = (media: MediaStream) => {
	if (!settings.video) {
		return;
	}
	session.pc = new PeerConnection();
	session.pc.addVideo(media);
	Object.freeze(session.pc);
};

export { webRTC, PeerConnection, createPC };
