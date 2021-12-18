import { backend, session } from "index.js";
import { clearArray } from "modules/array.js";
import { othervideo } from "ui/nodes/video.js";

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
	}

	ontrack = (event: RTCTrackEvent) => {
		othervideo.srcObject = event.streams[0];
	};

	onicecandidate = async (event: RTCPeerConnectionIceEvent) => {
		if (this.iceGatheringState === "complete") {
			return;
		}
		session.rtc.icelocal.push(event.candidate);
		clearTimeout(session.rtc.wait);
		session.rtc.wait = setTimeout(() => {
			backend.sendIdentifiedPOST("icecandidate", { candidate: session.rtc.icelocal });
			clearArray(session.rtc.icelocal);
			session.rtc.wait = null;
		}, 50);
	};

	addVideo(media: MediaStream) {
		const tracks = media.getTracks();
		for (const track of tracks) {
			this.addTrack(track, media);
		}
	}

	async offer(options?: RTCOfferOptions) {
		const videoSession = await this.createOffer(options);
		await this.setLocalDescription(videoSession);
		backend.sendIdentifiedPOST("rtcpeerdescription", { desc: videoSession });
	}

	async answer(options?: RTCOfferOptions) {
		const videoSession = await this.createAnswer(options);
		await this.setLocalDescription(videoSession);
		backend.sendIdentifiedPOST("rtcpeerdescription", { desc: videoSession });
	}

	async setRemote(description: RTCSessionDescriptionInit) {
		const answer = new RTCSessionDescription(description);
		await this.setRemoteDescription(answer);
	}

	wait = 0;
}

const eventHandlerRTC = async (event: backendEvent) => {
	const { rtc } = session;
	switch (event.name) {
		case "rtccall":
			rtc.call = true;
			pc.offer(WEB.constrains);
			break;
		case "rtcpeerdescription":
			pc.setRemote(event.data);
			rtc.peer = true;
			for (let i = 0; i < rtc.candidates.length; i++) {
				const signal = rtc.candidates[i];
				await pc.addIceCandidate(new RTCIceCandidate(signal));
			}
			rtc.candidates.splice(0, rtc.candidates.length);
			if (!rtc.call) {
				pc.answer(WEB.constrains);
			}
			break;
		case "icecandidate":
			if (!rtc.peer) {
				rtc.candidates.push(event.data);
				break;
			}
			pc.addIceCandidate(new RTCIceCandidate(event.data));
			break;
	}
};

const createPC = (media: MediaStream) => {
	pc = new PeerConnection();
	pc.addVideo(media);
	Object.freeze(pc);
};

const replaceTrack = async (mediaTrack: MediaStreamTrack) => {
	const senders = pc.getSenders();
	const sender = senders.find((s) => s.track.kind == mediaTrack.kind);
	sender.replaceTrack(mediaTrack);
};

const deletePC = () => {
	pc.close();
	delete pc.ontrack;
	delete pc.onicecandidate;
	pc = null;
};

let pc: PeerConnection;

export { eventHandlerRTC, createPC, deletePC, replaceTrack };
