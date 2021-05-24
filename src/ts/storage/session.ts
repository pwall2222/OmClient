class Session {
	started = false;
	connected = false;
	video = false;
	typing = false;
	rtc = {
		call: false,
		peer: false,
		candidates: <RTCIceCandidate[]>[],
	};
}

export { Session };
