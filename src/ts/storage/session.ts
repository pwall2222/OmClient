class Session {
	started = false;
	connected = false;
	video = false;
	typing = false;
	rtc = {
		call: false,
		peer: false,
		candidates: <RTCIceCandidate[]>[],
		icelocal: <RTCIceCandidate[]>[],
		wait: 0,
	};
}

export { Session };
