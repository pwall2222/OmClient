import { clearArray } from "./functions.js";
import { backend, session } from "./index.js";
import { videoNode } from "./nodes.js";

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
		mandatory: {
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: true,
		},
	},
};

const video = (media: MediaStream) => {
	const pc = new RTCPeerConnection(WEB.config);

	media.getTracks().forEach((track: MediaStreamTrack) => {
		pc.addTrack(track, media);
	});

	pc.ontrack = function (event: RTCTrackEvent) {
		videoNode.othervideo.srcObject = event.streams[0];
	};

	pc.onicecandidate = async function (event: RTCPeerConnectionIceEvent) {
		if (pc.iceGatheringState !== "complete") {
			await backend.sendIdentifiedPOST("icecandidate", { candidate: event.candidate });
			clearArray(session.current.rtc.candidates);
		}
	};
	return pc;
};

const webRTC = {
	async eventHandler(event: backendEvent) {
		const { pc, rtc } = session.current;
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
	async descriptionHandler(option: pcOption) {
		const videoSession = await session.current.pc[`create${option}`](WEB.constrains);
		await session.current.pc.setLocalDescription(videoSession);
		backend.sendIdentifiedPOST("rtcpeerdescription", { desc: videoSession });
	},
};

export { video, webRTC };
