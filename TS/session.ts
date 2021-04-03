import { Video } from "./webrtc.js";

class Session {
	active = false;
	connected = false;
	video = false;
	typing = false;
	pc = <Video>{};
	rtc = {
		call: false,
		peer: false,
		candidates: <RTCIceCandidate[]>[],
	};
}

export { Session };
