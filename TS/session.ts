class Session {
	active = false;
	connected = false;
	video = false;
	typing = false;
	pc = <RTCPeerConnection>{};
	rtc = {
		call: false,
		peer: false,
		candidates: <RTCIceCandidate[]>[],
	};
}

export { Session };
