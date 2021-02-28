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
		for (const key in domObject.args) {
			element[key] = domObject.args[key];
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

const createChildBefore = function (parent: string, reference: string, domObject: domObject) {
	const child = createElement(domObject);
	const parentNode = document.querySelector(parent);
	const referenceNode = parentNode.querySelector(reference);
	parentNode.insertBefore(child, referenceNode);
};

const clearChilds = function (nodeName: string) {
	const node = document.querySelector(nodeName);
	node.textContent = "";
};

const encodeObject = function (data: object) {
	const form_data: string[] = [];
	const append = function (key: string, value: string) {
		form_data.push(key + "=" + encodeURIComponent(value));
	}

	for (const key in data) {
		const value = data[key];
		if (typeof value == "string") {
			append(key, value);
		} else if (typeof value == "object") (
			append(key, JSON.stringify(value))
		)
	}
	return form_data.join("&");
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
			createChildBefore(".logbox", ".typing", {
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
				createChildBefore(".logbox", ".typing", {
					tag: "p",
					args: {
						className: "statuslog",
						textContent: text
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
					const last = likes.pop();
					const body = likes.join(", ");
					display = `You both like ${body} and ${last}.`;

				}
				chatNode.add.status.default(display);
			},
		},
	},
	typing(state: boolean) {
		session.current.typing = state;
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
			cmd.handler(chat_contents);
			chatNode.typebox.value = "";
		} else if (session.current.connected && chat_contents != "") {
			backend.sendIdentifiedPOST("send", { msg: chatNode.typebox.value })
			chatNode.add.message(chatNode.typebox.value, "you");
			chatNode.typebox.value = "";
			disconnectNode.set("stop");
		}
	}
};

const disconnectNode = {
	txt: document.querySelector(".dscnttxt"),
	btn: document.querySelector(".dscntbtn"),
	set(text: disconnectStatus) {
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

const session = {
	current: {
		id: "",
		server: "front26",
		connected: false,
		typing: false,
		rtc: {
			call: false,
			peer: false,
			candidates: <RTCIceCandidate[]>[]
		}
	},
	reset() {
		this.current = {
			id: "",
			server: "front26",
			connected: false,
			typing: false,
			rtc: {
				call: false,
				peer: false,
				candidates: []
			}
		}
	}
};

const settings = {
	autoskip: false,
	autoskip_delay: 500,
	autoclearchat: true,
	cmd_history: 25,
	likes: <string[]>[],
	likes_enabled: false,
	lang: "en",
	video: true,
	socials: {}
};

const setting_manager = {
	load() {
		const item = JSON.parse(localStorage.getItem("settings"));
		for (const key in item) {
			settings[key] = item[key];
		}
	},
	save() {
		localStorage.setItem("settings", JSON.stringify(settings));
	},
	clear() {
		localStorage.clear();
	}
};

const cmd = {
	handler(contents: string) {
		const full_command = contents.slice(1).split(" ");
		const command_name = full_command[0];
		const args = full_command.slice(1, full_command.length - 0);
		const commands: command[] = [
			{
				name: "help",
				description: "Shows the help information",
				exec() {
					// TODO: Adding help response
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
				}
			},
			{
				name: "set",
				description: "Sets one of the avaliable settings",
				exec() {
					const parsed_arg = JSON.parse(args[1]);
					if (typeof settings[args[0]] == typeof parsed_arg) {
						settings[args[0]] = parsed_arg;
					} else {
						console.log("Wrong type")
					}
				}
			},
			{
				name: "skip",
				description: "Skips current person starting a new chat",
				exec() {
					backend.disconnect();
					newChat();
				}
			},
			{
				name: "disconnect",
				description: "Disconnects from the current stranger",
				exec() {
					disconnect();
				}
			},
			{
				name: "save",
				description: "Saves settings to localStorage",
				exec() {
					setting_manager.save();
				}
			},
			{
				name: "text",
				description: "Passes mode to text and makes a new chat",
				exec() {
					if (session.current.connected == false) {
						settings.video = false;
						newChat();
					}
				}
			},
			{
				name: "socials",
				description: "Sends socials to stranger",
				exec() {
					if (session.current.connected) {
						let msg = "";
						for (const key in settings.socials) {
							msg += `${key}: ${settings.socials[key]}\n` 
						}
						backend.sendIdentifiedPOST("send", { msg });
						chatNode.add.message(chatNode.typebox.value, "you");					
					}
				}
			}
		];
		commands.find(obj => obj.name == command_name)?.exec();
		if (contents != cmd.command_history[0]) {
			cmd.command_history.unshift(contents);
			cmd.command_history.splice(settings.cmd_history, 1);
			cmd.save();
		}
		cmd.position = -1;
	},
	command_history: [],
	position: -1,
	current: "",
	next() {
		const new_position = cmd.position + 1;
		if (cmd.position == -1) {
			cmd.current = chatNode.typebox.value;
		}
		cmd.change_val(new_position);
	},
	previous() {
		const new_position = cmd.position - 1;
		if (new_position <= -1) {
			chatNode.typebox.value = cmd.current;
			cmd.position = -1;
		} else cmd.change_val(new_position);
	},
	change_val(new_position: number) {
		if (cmd.command_history.length > 0 && cmd.command_history.length > new_position) {
			cmd.position = new_position;
			chatNode.typebox.value = cmd.command_history[new_position];
		}
	},
	load() {
		const item = JSON.parse(localStorage.getItem("history"));
		if (item) {
			cmd.command_history = item;
		}
	},
	save() {
		localStorage.setItem("history", JSON.stringify(cmd.command_history));
	},
};

const disconnectHandler = function (user: string) {
	if (session.current.connected) {
		chatNode.add.status.default(`${user} Disconnected`);
		disconnectNode.set("new");
		session.current.connected = false;
		document.querySelector(".typing")?.remove();
	}
	if (settings.autoskip) {
		setTimeout(() => {
			newChat();
		}, settings.autoskip_delay);
	}
	document.querySelector(".spinner")?.remove();
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
					if (key.shiftKey && session.current.connected) {
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
			} else if (key.code == "ArrowUp") {
				cmd.next();
				key.preventDefault();
			} else if (key.code == "ArrowDown") {
				cmd.previous();
				key.preventDefault();
			}
		}
	}
};

const backend = {
	async sendPOST(path: string, data: string) {
		return fetch(`https://${session.current.server}.omegle.com/${path}`, {
			method: 'POST',
			body: data,
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
			referrerPolicy: "no-referrer"
		});
	},
	sendIdentifiedPOST: (path: string, data = {}) => backend.sendPOST(path, encodeObject({ id: session.current.id, ...data })),
	async connect() {
		const args = [
			"firstevents=0",
			`lang=${settings.lang}`
		];

		if (settings.likes_enabled) {
			args.push(`topics=${encodeURIComponent(JSON.stringify(settings.likes))}`)
		}

		if (settings.video) {
			args.push("webrtc=1")
		}

		const url = `https://${session.current.server}.omegle.com/start?${args.join("&")}`
		const response = await fetch(url, { method: "POST", referrerPolicy: "no-referrer" })
		return response.json();
	},
	disconnect: () => backend.sendIdentifiedPOST("disconnect")
};

const newChat = async function () {
	const eventHandler = {
		executer: async function (event: backendEvent) {
			switch (event.name) {
				case "rtccall":
					session.current.rtc.call = true;
					descriptionHandler("Offer");
					break;
				case "rtcpeerdescription":
					const answer = new RTCSessionDescription(event.data);
					await pc.setRemoteDescription(answer)
					session.current.rtc.peer = true;
					for (let i = 0; i < session.current.rtc.candidates.length; i++) {
						const signal = session.current.rtc.candidates[i];
						await pc.addIceCandidate(new RTCIceCandidate(signal));
					}
					session.current.rtc.candidates.splice(0, session.current.rtc.candidates.length)
					if (!session.current.rtc.call) {
						descriptionHandler("Answer");
					}
					break;
				case "icecandidate":
					if (!session.current.rtc.peer) {
						session.current.rtc.candidates.push(event.data);
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
					chatNode.clear();
					chatNode.add.status.connected();
					session.current.connected = true;
					break;
				case "strangerDisconnected":
					videoNode.othervideo.srcObject = null;
					disconnectHandler("Stranger");
					break;
				case "waiting":
					chatNode.clear();
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
		},
		async subscribe() {
			const response = await backend.sendIdentifiedPOST("events");
			switch (response.status) {
				case 200:
					const events = await response.json();
					if (events != null) {
						eventHandler.parser(events);
						await eventHandler.subscribe();
					}
					break;

				case 502:
					await eventHandler.subscribe();
					break;

				case 400:
					console.log("Server barked:" + response.statusText);
					break;

				default:
					console.log("Server barked:" + response.statusText);
					await new Promise(resolve => setTimeout(resolve, 1000));
					await eventHandler.subscribe();
					break;
			}
		}
	};

	const descriptionHandler = async function (option: pcOption) {
		const session = await pc[`create${option}`](WEB_RTC_MEDIA_CONSTRAINTS);
		await pc.setLocalDescription(session)
		backend.sendIdentifiedPOST("rtcpeerdescription", { desc: session });
	};

	session.reset();

	disconnectNode.set("stop");

	chatNode.clear();
	chatNode.add.status.default("Conneting to server...");

	if (settings.autoclearchat) {
		chatNode.typebox.value = "";
	}

	createChild("#videowrapper", { tag: "div", args: { className: "spinner" } })

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
			await backend.sendIdentifiedPOST("icecandidate", { candidate: event.candidate });
			clearArray(session.current.rtc.candidates);
		}
	}

	const start = await backend.connect();
	eventHandler.parser(start.events);
	session.current.id = start.clientID;

	eventHandler.subscribe();
};

keyboard.init();
setting_manager.load();
cmd.load();