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

const encodeObject = function (data?: object) {
	const form = {
		data: [],
		append(key: string, value: string) {
			this.data.push(key + "=" + encodeURIComponent(value));
		}
	}
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
};

const disconnect = function () {
	backend.disconnect();
	videoNode.othervideo.srcObject = null;
	disconnectHandler("You");
};

const chatNode = {
	logbox: document.querySelector(".logbox"),
	typebox: document.querySelector<HTMLTextAreaElement>(".chatmsg"),
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
	typing(state: boolean) {
		current_session.typing = state;
		if (state) {
			chatNode.add.status.typing();
		} else {
			document.querySelector(".typing")?.remove();
		}
	},
	clear() {
		clearChilds(".logbox");
	},
	scroll() {
		chatNode.logbox.scroll(0, chatNode.logbox.scrollHeight);
	},
	handleInput() {
		const chat_contents = chatNode.typebox.value;
		if (chat_contents[0] == "/") {
			const full_command = chat_contents.slice(1).split(" ");
			const command_name = full_command[0];
			const args = full_command.slice(1, full_command.length - 0);
			switch (command_name) {
				case "help":
					// TODO: Adding help response
					const commands = [
						{
							name: "help",
							description: "Shows the help information"
						},
						{
							name: "set",
							description: "Sets one of the avaliable settings"
						},
						{
							name: "skip",
							description: "Skips current person starting a new chat"
						},
						{
							name: "disconnect",
							description: "Disconnects from the current stranger"
						}
					]
					let instructions = "";
					for (let i = 0; i < commands.length; i++) {
						const elements = commands[i];
						const nameCapitalized = elements.name.charAt(0).toUpperCase() + elements.name.slice(1)
						instructions += `<b>${nameCapitalized}</b>:<br>${elements.description}<br>`
					}
					createChild(".logbox", {
						tag: "p",
						args: {
							innerHTML: instructions,
							className: "command"
						}
					})
					break;

				case "set":
					// TODO: Checking user input
					if (settings.data[args[0]] != undefined) {
						settings.data[args[0]] = JSON.parse(args[1]);
					}
					break;

				case "skip":
					backend.disconnect();
					newChat();
					break;

				case "disconnect":
					disconnect();
					break;

				case "save":
					settings.save();
					break;
			}
			chatNode.typebox.value = "";
		} else if (current_session.connected && chat_contents != "") {
			backend.sendEncodedPOST("send", { msg: chatNode.typebox.value })
			chatNode.add.message(chatNode.typebox.value, "you");
			chatNode.typebox.value = "";
			disconnectNode.set("stop");
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
				disconnectNode.set("rlly");
				break;

			case "rlly":
				disconnectNode.set("new");
				disconnect();
				break;

			case "new":
				disconnectNode.set("stop");
				newChat();
				break;
		}
	}
};

const videoNode = {
	othervideo: document.querySelector<HTMLVideoElement>("#othervideo"),
	selfvideo: document.querySelector<HTMLVideoElement>("#selfvideo")
};

const spinnerNode = {
	add: () => createChild("#videowrapper", { tag: "div", args: { className: "spinner" } }),
	remove: () => document.querySelector(".spinner")?.remove()
};

const current_session = {
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
		current_session.id = "";
		current_session.typing = false;
		current_session.connected = false;
		/* current_session.server = ""; */
		current_session.rtc = {
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
	load() {
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
	if (current_session.connected) {
		chatNode.add.status.default(`${user} Disconnected`);
		disconnectNode.set("new");
		current_session.connected = false;
	}
	if (settings.data.autoskip) {
		setTimeout(() => {
			newChat();
		}, settings.data.autoskip_delay);
	}
	spinnerNode.remove();
};

const keyboard = {
	init() {
		document.querySelector(".chatmsg").addEventListener("keydown", keyboard.handler.chatbox);
		document.body.addEventListener("keydown", keyboard.handler.doc);
	},
	handler: {
		doc(key: KeyboardEvent) {
			switch (key.code) {
				case "Escape":
					if (key.shiftKey && current_session.connected) {
						key.preventDefault();
						backend.disconnect();
						newChat();
					} else {
						key.preventDefault();
						disconnectNode.handler();
					}
					break;

				case "Slash":
					if (chatNode.typebox.value == "") {
						chatNode.typebox.focus();
					}
					break;

				default:
					break;
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
		return fetch(`https://${current_session.server}.omegle.com/${path}`, {
			method: 'POST',
			body: data,
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
			referrerPolicy: "no-referrer"
		});
	},
	sendEncodedPOST: (path: string, data = {}) => backend.sendPOST(path, encodeObject({ id: current_session.id, ...data })),
	async connect() {
		const args = [
			"firstevents=0",
			`lang=${settings.data.lang}`
		];

		if (settings.data.likes_enabled) {
			args.push(`topics=${encodeURIComponent(JSON.stringify(settings.data.likes))}`)
		}

		if (settings.data.video) {
			args.push("webrtc=1")
		}

		const url = `https://${current_session.server}.omegle.com/start?${args.join("&")}`
		const response = await fetch(url, { method: "POST", referrerPolicy: "no-referrer" })
		return response.json();
	},
	disconnect: () => backend.sendEncodedPOST("disconnect")
};

const newChat = async function () {
	const eventHandler = {
		executer: async function (event: backendEvent) {
			switch (event.name) {
				case "rtccall":
					current_session.rtc.call = true;
					descriptionHandler("Offer");
					break;
				case "rtcpeerdescription":
					const answer = new RTCSessionDescription(event.data);
					await pc.setRemoteDescription(answer)
					current_session.rtc.peer = true;
					for (let i = 0; i < current_session.rtc.candidates.length; i++) {
						const signal = current_session.rtc.candidates[i];
						await pc.addIceCandidate(new RTCIceCandidate(signal));
					}
					current_session.rtc.candidates.splice(0, current_session.rtc.candidates.length)
					if (!current_session.rtc.call) {
						descriptionHandler("Answer");
					}
					break;
				case "icecandidate":
					if (!current_session.rtc.peer) {
						current_session.rtc.candidates.push(event.data);
					} else {
						pc.addIceCandidate(new RTCIceCandidate(event.data));
					}
					break;
				case "gotMessage":
					chatNode.typing(false);
					chatNode.add.message(event.data, "stranger");
					break;
				case "typing":
					chatNode.typing(true);
					break;
				case "stoppedTyping":
					chatNode.typing(false);
					break;
				case "commonLikes":
					chatNode.add.status.likes(event.data);
					break;
				case "connected":
					current_session.connected = true;
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
		backend.sendEncodedPOST("rtcpeerdescription", { desc: session });
	};

	current_session.reset();

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
	}
	pc.onicecandidate = async function (event) {
		if (pc.iceGatheringState != "complete") {
			await backend.sendEncodedPOST("icecandidate", { candidate: event.candidate });
			clearArray(current_session.rtc.candidates);
		}
	}

	const start = await backend.connect();
	eventHandler.parser(start.events);
	current_session.id = start.clientID;

	const socket = new WebSocket(`wss://${current_session.server}.omegle.com/wsevents?id=${encodeURIComponent(start.clientID)}`);
	socket.onmessage = function (rawevents) {
		const events = JSON.parse(rawevents.data);
		eventHandler.parser(events);
	};
};

keyboard.init();
settings.load();