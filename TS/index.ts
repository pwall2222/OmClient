interface backendEvent {
	name: string;
	data?: any;
}

interface domObject {
	tag: string;
	args?: args;
	child?: domObject;
}

interface args {
	accessKey?: string;
	autocapitalize?: string;
	dir?: string;
	draggable?: boolean;
	hidden?: boolean;
	innerText?: string;
	lang?: string;
	spellcheck?: boolean;
	title?: string;
	translate?: boolean;
	autofocus?: boolean;
	nonce?: string;
	tabIndex?: number;
	contentEditable?: string;
	enterKeyHint?: string;
	inputMode?: string;
	className?: string;
	id?: string;
	innerHTML?: string;
	outerHTML?: string;
	scrollLeft?: number;
	scrollTop?: number;
	slot?: string;
	nodeValue?: string | null;
	textContent?: string | null;
	/* [key: string]: unknown */
}

type dStatus = "stop" | "rlly" | "new";
type author = "you" | "stranger";
type pcOption = "Offer" | "Answer";

const WEB_RTC_CONFIG = {
	iceServers: [{
		urls: "stun:stun.l.google.com:19302"
	}, {
		urls: "stun:stun.services.mozilla.com"
	}]
};
const WEB_RTC_MEDIA_CONSTRAINTS = {
	mandatory: {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true
	}
};
const WEB_RTC_PEER_CONSTRAINTS = {
	optional: [{
		DtlsSrtpKeyAgreement: true
	}]
};

const clearArray = function (array: any[]) {
	return array.splice(0, array.length);
};

const createElement = function (domObject: domObject) {
	const element = document.createElement(domObject.tag);
	if (domObject.args) {
		for (const [key, value] of Object.entries(domObject.args)) {
			element[key] = value;
		}
	}
	if (domObject.child) {
		element.appendChild(createElement(domObject.child));
	}
	return element;
};

const createChild = function (parent: string, domObject: domObject) {
	const child = createElement(domObject);
	document.querySelector(parent).appendChild(child);
};

const clearChilds = function (nodeName: string) {
	const node = document.querySelector(nodeName);
	node.textContent = "";
};

const encodeObjectAndAddID = function (data?: object) {
	const form = {
		data: [],
		append(key: string, value: string) {
			this.data.push(key + "=" + encodeURIComponent(value));
		}
	}
	form.append("id", stats.id);
	if (data) {
		for (const key in data) {
			const value = data[key];
			if (typeof value == "string") {
				form.append(key, value);
			} else if (typeof value == "object") (
				form.append(key, JSON.stringify(value))
			)
		}
	}
	return form.data.join("&");
}

const chatNode = {
	logbox: document.querySelector(".logbox"),
	typebox: (document.querySelector(".chatmsg") as HTMLTextAreaElement),
	add: {
		message(message: string, sender: author) {
			const pclass = `${sender}msg`;
			const user = sender == "you" ? "You" : "Stranger";
			createChild(".logbox", {
				tag: "div",
				child: {
					tag: "p",
					args: {
						className: pclass,
						innerHTML: `<strong class="msgsource">${user}: </strong>`,
					},
					child: {
						tag: "span",
						args: {
							textContent: message
						}
					}
				}
			});
		},
		status: {
			default(text: string) {
				createChild(".logbox", {
					tag: "div",
					args: {
						className: "logitem"
					},
					child: {
						tag: "p",
						args: {
							className: "statuslog",
							textContent: text
						}
					}
				});
				chatNode.scroll();
			},
			connected() {
				chatNode.add.status.default("You're now chatting with a random stranger.");
			},
			typing() {
				createChild(".logbox", {
					tag: "div",
					args: {
						className: "logitem typing"
					},
					child: {
						tag: "p",
						args: {
							className: "statuslog",
							innerText: "Stranger is typing..."
						}
					}
				});
				stats.typing = true;
				chatNode.scroll();
			},
			likes(likes: string[]) {
				let display: string;
				if (likes.length < 0) {
					display = "Couldn't find a stranger with same interests.";
				}
				else if (likes.length == 1) {
					display = `You both like ${likes[0]}.`;
				}
				else if (likes.length > 1) {
					const body = likes.join(", ");
					const last = likes.pop();
					display = `You both like ${body} and ${last}.`;

				}
				chatNode.add.status.default(display);
			},
		},
	},
	clear() {
		clearChilds(".logbox");
	},
	scroll() {
		chatNode.logbox.scroll(0, chatNode.logbox.scrollHeight);
	},
	handleInput() {
		const contents = chatNode.typebox.value;
		if (contents[0] == "/") {
			chatNode.typebox.value = "";
		} else if (stats.connected && contents != "") {
			backend.sendEncodedPOST("send", { msg: chatNode.typebox.value })
			chatNode.add.message(chatNode.typebox.value, "you");
			chatNode.typebox.value = "";
		}
	}
};

const disconnectNode = {
	txt: document.querySelector(".dscnttxt"),
	btn: document.querySelector(".dscntbtn"),
	set(text: dStatus) {
		switch (text) {
			case "stop":
				disconnectNode.btn.className = "dscntbtn stop";
				disconnectNode.txt.textContent = "Stop";
				break;

			case "rlly":
				disconnectNode.btn.className = "dscntbtn rlly";
				disconnectNode.txt.textContent = "Really?";
				break;

			case "new":
				disconnectNode.btn.className = "dscntbtn new";
				disconnectNode.txt.textContent = "New";
				break;
		}
	},
	handler() {
		switch (disconnectNode.btn.classList[1]) {
			case "stop":
				disconnectNode.set("rlly")
				break;

			case "rlly":
				disconnectNode.set("new");
				backend.disconnect();
				break;

			case "new":
				disconnectNode.set("stop");
				newChat();
				break;
		}
	}
};

const videoNode = {
	othervideo: (document.querySelector("#othervideo") as HTMLVideoElement),
	selfvideo: (document.querySelector("#selfvideo") as HTMLVideoElement)
};

const spinnerNode = {
	add() {
		createChild("#videowrapper", { tag: "div", args: { className: "spinner" } });
	},
	remove() {
		document.querySelector(".spinner")?.remove();
	}
}

const stats = {
	id: "",
	server: "front26",
	connected: false,
	typing: false,
	rtc: {
		call: false,
		peer: false,
		candidates: []
	},
	reset() {
		stats.id = "";
		stats.typing = false;
		stats.connected = false;
		/* stats.server = ""; */
		stats.rtc = {
			call: false,
			peer: false,
			candidates: []
		}
	}
};

const settings = {
	data: {
		autoskip: false,
		autoskip_delay: 500,
		likes: [],
		likes_enabled: false,
		lang: "en",
		video: true
	},
	get() {
		const item = JSON.parse(localStorage.getItem('settings'));
		if (item) {
			settings.data = item;
		}
	},
	save() {
		localStorage.setItem('settings', JSON.stringify(settings.data));
	},
	clear() {
		localStorage.clear();
	}
};

const disconnectHandler = function (user: string) {
	if (stats.connected) {
		chatNode.add.status.default(`${user} Disconnected`);
		disconnectNode.set("new");
		stats.connected = false;
		spinnerNode.remove();
	}
	if (settings.data.autoskip) {
		setTimeout(() => {
			newChat();
		}, settings.data.autoskip_delay);
	}
};

const keyboard = {
	init() {
		document.querySelector(".chatmsg").addEventListener("keydown", keyboard.handler.chatbox);
		document.body.addEventListener("keydown", keyboard.handler.doc);
	},
	handler: {
		doc(key: KeyboardEvent) {
			if (key.code == "Escape") {
				if (key.shiftKey && stats.connected) {
					key.preventDefault();
					backend.disconnect();
					newChat();
				} else {
					key.preventDefault();
					disconnectNode.handler();
				}
			}
		},
		chatbox(key: KeyboardEvent) {
			if (key.code == "Enter" && !key.shiftKey) {
				key.preventDefault();
				chatNode.handleInput();
			}
		}
	}
};

const backend = {
	async sendPOST(path: string, data: string) {
		return fetch(`https://${stats.server}.omegle.com/${path}`, {
			method: 'POST',
			body: data,
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
			referrerPolicy: "no-referrer"
		});
	},
	sendEncodedPOST(path: string, data: object) {
		return backend.sendPOST(path, encodeObjectAndAddID(data))
	},
	connect: (args: string[]) => fetch(`https://${stats.server}.omegle.com/start?${args.join("&")}`, { method: 'POST', referrerPolicy: "no-referrer" }).then(response => response.json()),
	disconnect: () => backend.sendPOST("disconnect", "id=" + encodeURIComponent(stats.id))
};

keyboard.init();

const newChat = async function () {
	const eventHandler = {
		executer: async function (event: backendEvent) {
			switch (event.name) {
				case "rtccall":
					stats.rtc.call = true;
					descriptionHandler("Offer");
					break;
				case "rtcpeerdescription":
					const answer = new RTCSessionDescription(event.data);
					await pc.setRemoteDescription(answer)
					stats.rtc.peer = true;
					for (let i = 0; i < stats.rtc.candidates.length; i++) {
						const signal = stats.rtc.candidates[i];
						await pc.addIceCandidate(new RTCIceCandidate(signal));
					}
					stats.rtc.candidates.splice(0, stats.rtc.candidates.length)
					if (!stats.rtc.call) {
						descriptionHandler("Answer");
					}
					break;
				case "icecandidate":
					if (!stats.rtc.peer) {
						stats.rtc.candidates.push(event.data);
					} else {
						pc.addIceCandidate(new RTCIceCandidate(event.data));
					}
					break;
				case "gotMessage":
					chatNode.add.message(event.data, "stranger");
					break;
				case "commonLikes":
					chatNode.add.status.likes(event.data);
					break;
				case "connected":
					stats.connected = true;
					chatNode.add.status.connected();
					break;
				case "strangerDisconnected":
					socket.close();
					videoNode.othervideo.srcObject = null;
					disconnectHandler("Stranger");
					break;
				case "waiting":
					chatNode.add.status.default("Waiting");
					break;
				default:
					console.log(event);
					break;
			}
		},
		parser(events: object[]) {
			for (let i = 0; i < events?.length; i++) {
				const event = {
					name: events[i][0],
					data: events[i][1]
				};
				eventHandler.executer(event);
			}
		}
	};

	const descriptionHandler = async function (option: pcOption) {
		const session = await pc[`create${option}`](WEB_RTC_MEDIA_CONSTRAINTS);
		await pc.setLocalDescription(session)
		backend.sendPOST("rtcpeerdescription", encodeObjectAndAddID({ desc: session }));
	};

	stats.reset();

	disconnectNode.set("stop");

	chatNode.clear();
	chatNode.typebox.value = "";
	chatNode.add.status.default("Conneting to server");
	spinnerNode.add();

	const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true } });
	videoNode.selfvideo.srcObject ??= media;
	videoNode.selfvideo.muted = true;
	videoNode.othervideo.srcObject = null;

	const pc = new RTCPeerConnection(WEB_RTC_CONFIG);

	media.getTracks().forEach(function (track) {
		pc.addTrack(track, media);
	});

	pc.ontrack = function (event) {
		videoNode.othervideo.srcObject = event.streams[0];
		spinnerNode.remove();
	}
	pc.onicecandidate = async function (event) {
		if (pc.iceGatheringState != "complete") {
			await backend.sendEncodedPOST("icecandidate", { candidate: event.candidate });
			clearArray(stats.rtc.candidates);
		}
	}

	const args = [
		"caps=recaptcha2",
		"firstevents=0",
		"spid=",
		"randid=4ALLVR8L",
		`lang=${settings.data.lang}`,
		`webrtc=${Number(settings.data.video)}`
	];

	if (settings.data.likes_enabled) {
		args.push(`topics=${encodeURIComponent(JSON.stringify(settings.data.likes))}`)
	}

	const start = await backend.connect(args);
	eventHandler.parser(start.events);
	stats.id = start.clientID;

	const socket = new WebSocket(`wss://${stats.server}.omegle.com/wsevents?id=${encodeURIComponent(start.clientID)}`);
	socket.onmessage = function (rawevents) {
		const events = JSON.parse(rawevents.data);
		eventHandler.parser(events);
	};
}