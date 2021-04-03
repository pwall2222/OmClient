const session = {
	current: {
		id: "",
		server: "",
		active: false,
		connected: false,
		video: false,
		typing: false,
		pc: <RTCPeerConnection>{},
		rtc: {
			call: false,
			peer: false,
			candidates: <RTCIceCandidate[]>[],
		},
	},
	history: <string[]>[],
	reset() {
		this.current = {
			id: "",
			server: this.current.server,
			active: false,
			connected: false,
			video: false,
			typing: false,
			pc: {},
			rtc: {
				call: false,
				peer: false,
				candidates: [],
			},
		};
	},
};

export { session };
