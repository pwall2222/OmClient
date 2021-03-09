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

const encodeObject = function (data: object) {
	const formData: string[] = [];
	const append = function (key: string, value: string) {
		formData.push(key + "=" + encodeURIComponent(value));
	};

	for (const key in data) {
		const value = data[key];
		if (typeof value == "string") {
			append(key, value);
		} else if (typeof value == "object") {
			append(key, JSON.stringify(value));
		}
	}
	return formData.join("&");
};

const video = function (media: MediaStream) {
	const pc = new RTCPeerConnection(WEB.config);

	media.getTracks().forEach(function (track) {
		pc.addTrack(track, media);
	});

	pc.ontrack = function (event) {
		videoNode.othervideo.srcObject = event.streams[0];
	};

	pc.onicecandidate = async function (event) {
		if (pc.iceGatheringState != "complete") {
			await backend.sendIdentifiedPOST("icecandidate", { candidate: event.candidate });
			clearArray(session.current.rtc.candidates);
		}
	};
	return pc;
};

const disconnect = function () {
	backend.disconnect();
	videoNode.othervideo.srcObject = null;
	disconnectHandler("You");
};

const skip = function () {
	backend.disconnect();
	clearAllElements(".spinner");
	newChat();
};

const disconnectHandler = function (user: string) {
	if (session.current.active) {
		chatNode.add.status.default(`${user} Disconnected`);
		disconnectNode.set("new");
		session.current.active = false;
		session.current.connected = false;
		document.querySelector(".typing")?.remove();
	}
	if (settings.autoskip) {
		setTimeout(() => {
			if (!session.current.connected) {
				newChat();
			}
		}, settings.autoskip_delay);
	}
	clearAllElements(".spinner");
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
							textContent: message,
						},
					},
				},
			});
		},
		status: {
			default(text: string) {
				createChildBefore(".logbox", ".typing", {
					tag: "p",
					args: {
						className: "statuslog",
						textContent: text,
					},
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
						className: "logitem typing",
					},
					child: {
						tag: "p",
						args: {
							className: "statuslog",
							innerText: "Stranger is typing...",
						},
					},
				});
				chatNode.scroll();
			},
			likes(likes: string[]) {
				let display: string;
				if (likes.length < 0) {
					display = "Couldn't find a stranger with same interests.";
				} else if (likes.length == 1) {
					display = `You both like ${likes[0]}.`;
				} else if (likes.length > 1) {
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
		const chatContents = chatNode.typebox.value;
		if (chatContents[0] == "/") {
			cmd.handler(chatContents);
			chatNode.typebox.value = "";
		} else if (session.current.active && chatContents != "") {
			backend.sendIdentifiedPOST("send", { msg: chatNode.typebox.value });
			chatNode.add.message(chatNode.typebox.value, "you");
			chatNode.typebox.value = "";
			disconnectNode.set("stop");
		}
	},
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
				if (!session.current.connected) {
					newChat();
				}
				break;
		}
	},
};

const videoNode = {
	othervideo: document.querySelector<HTMLVideoElement>("#othervideo"),
	selfvideo: document.querySelector<HTMLVideoElement>("#selfvideo"),
};

const session = {
	current: {
		id: "",
		server: "",
		active: false,
		connected: false,
		typing: false,
		pc: <RTCPeerConnection>{},
		rtc: {
			call: false,
			peer: false,
			candidates: <RTCIceCandidate[]>[],
		},
	},
	reset() {
		this.current = {
			id: "",
			server: this.current.server,
			active: false,
			connected: false,
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

const settings = {
	autoskip: false,
	autoskip_delay: 500,
	autoclearchat: true,
	cmd_history: 25,
	likes: <string[]>[],
	likes_enabled: false,
	lang: "en",
	video: true,
	socials: {},
};

const settingManager = {
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
	},
};

const cmd = {
	handler(contents: string) {
		const fullCommand = contents.slice(1).split(" ");
		const commandName = fullCommand[0];
		const args = fullCommand.slice(1, fullCommand.length - 0);
		const commands: command[] = [
			{
				name: "Help",
				alias: ["help"],
				description: "Shows the help information",
				exec() {
					const instructions = commands.reduce((val, element) => `${val}<b>${element.name}</b>:<br>${element.description}<br>`, "");
					createChild(".logbox", {
						tag: "p",
						args: {
							innerHTML: instructions,
							className: "command",
						},
					});
				},
			},
			{
				name: "Set",
				alias: ["set"],
				description: "Sets one of the avaliable settings",
				exec() {
					const parsedArgs = JSON.parse(args[1]);
					if (typeof settings[args[0]] == typeof parsedArgs) {
						settings[args[0]] = parsedArgs;
					} else {
						console.log("Wrong type");
					}
				},
			},
			{
				name: "Skip",
				alias: ["skip"],
				description: "Skips current person starting a new chat",
				exec() {
					skip();
				},
			},
			{
				name: "Disconnect",
				alias: ["disconnect", "stop"],
				description: "Disconnects from the current stranger",
				exec() {
					disconnect();
				},
			},
			{
				name: "Save",
				alias: ["save"],
				description: "Saves settings to localStorage",
				exec() {
					settingManager.save();
				},
			},
			{
				name: "Text",
				alias: ["text"],
				description: "Passes mode to text and makes a new chat",
				exec() {
					if (!session.current.connected) {
						settings.video = false;
						newChat();
					}
				},
			},
			{
				name: "Socials",
				alias: ["socials"],
				description: "Sends socials to stranger",
				exec() {
					if (session.current.active) {
						let msg = "";
						for (const key in settings.socials) {
							msg += `${key}: ${settings.socials[key]}\n`;
						}
						backend.sendIdentifiedPOST("send", { msg });
						chatNode.add.message(chatNode.typebox.value, "you");
					}
				},
			},
			{
				name: "Autoskip",
				alias: ["autoskip"],
				description: "Switches autoskip",
				exec() {
					settings.autoskip = !settings.autoskip;
				},
			},
			{
				name: "Send",
				alias: ["send"],
				description: "Sends a message in chat",
				exec() {
					const msg = args.join(" ");
					if (session.current.active) {
						backend.sendIdentifiedPOST("send", { msg: msg });
						chatNode.add.message(msg, "you");
					}
				},
			},
		];
		commands.find((obj) => obj.alias.some((alias) => alias == commandName))?.exec();
		if (contents != cmd.commandHistory[0]) {
			cmd.commandHistory.unshift(contents);
			cmd.commandHistory.splice(settings.cmd_history, 1);
			cmd.save();
		}
		cmd.position = -1;
	},
	commandHistory: [],
	position: -1,
	current: "",
	next() {
		const newPosition = cmd.position + 1;
		if (cmd.position == -1) {
			cmd.current = chatNode.typebox.value;
		}
		cmd.changeVal(newPosition);
	},
	previous() {
		const newPosition = cmd.position - 1;
		if (newPosition <= -1) {
			chatNode.typebox.value = cmd.current;
			cmd.position = -1;
		} else cmd.changeVal(newPosition);
	},
	changeVal(newPosition: number) {
		if (cmd.commandHistory.length > 0 && cmd.commandHistory.length > newPosition) {
			cmd.position = newPosition;
			chatNode.typebox.value = cmd.commandHistory[newPosition];
		}
	},
	load() {
		const item = JSON.parse(localStorage.getItem("history"));
		if (item) {
			cmd.commandHistory = item;
		}
	},
	save() {
		localStorage.setItem("history", JSON.stringify(cmd.commandHistory));
	},
};

const keyboard = {
	init() {
		document.body.addEventListener("keydown", keyboard.handler);
	},
	handler(keyEvent: KeyboardEvent) {
		const target = keyEvent.target as HTMLElement;

		const events = [
			{
				key: "Enter",
				tag: "chatmsg",
				exec() {
					if (!keyEvent.shiftKey) {
						keyEvent.preventDefault();
						chatNode.handleInput();
					}
				},
			},
			{
				key: "ArrowUp",
				tag: "chatmsg",
				exec() {
					keyEvent.preventDefault();
					cmd.next();
				},
			},
			{
				key: "ArrowDown",
				tag: "chatmsg",
				exec() {
					keyEvent.preventDefault();
					cmd.previous();
				},
			},
			{
				key: "Escape",
				tag: "body",
				exec() {
					keyEvent.preventDefault();
					if (keyEvent.shiftKey && session.current.active) {
						skip();
					} else if (keyEvent.ctrlKey && settings.autoskip) {
						settings.autoskip = false;
						disconnect();
						settings.autoskip = true;
					} else {
						disconnectNode.handler();
					}
				},
			},
			{
				key: "Slash",
				tag: "body",
				exec() {
					if (chatNode.typebox.value == "") {
						chatNode.typebox.focus();
					}
				},
			},
			{
				key: "ContextMenu",
				tag: "body",
				exec() {
					keyEvent.preventDefault();
					skip();
				},
			},
		];

		const filter = (element: keyEvents) => element.key == keyEvent.code && (element.tag == target.className || element.tag == "body");
		events.find(filter)?.exec();
	},
};

const backend = {
	sendPOST(path: string, data: string) {
		return fetch(`https://${session.current.server}.omegle.com/${path}`, {
			method: "POST",
			body: data,
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			referrerPolicy: "no-referrer",
		});
	},
	sendIdentifiedPOST: (path: string, data?: object) => backend.sendPOST(path, encodeObject({ id: session.current.id, ...(data || {}) })),
	async connect() {
		const args = ["firstevents=0", `lang=${settings.lang}`];

		if (settings.likes_enabled) {
			args.push(`topics=${encodeURIComponent(JSON.stringify(settings.likes))}`);
		}

		if (settings.video) {
			args.push("webrtc=1");
		}

		const url = `https://${session.current.server}.omegle.com/start?${args.join("&")}`;
		const response = await fetch(url, { method: "POST", referrerPolicy: "no-referrer" });
		return response.json();
	},
	disconnect: () => backend.sendIdentifiedPOST("disconnect"),
	async server() {
		const info = await fetch("http://omegle.com/status").then((data) => data.json());
		session.current.server = info.servers[Math.floor(Math.random() * info.servers.length)];
	},
};

const eventHandler = {
	executer: async function (event: backendEvent) {
		switch (event.name) {
			case "rtccall":
			case "rtcpeerdescription":
			case "icecandidate":
				webRTC.eventHandler(event);
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
				session.current.active = true;
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
				data: events[i][1],
			};
			eventHandler.executer(event);
		}
	},
	async subscribe() {
		const response = await backend.sendIdentifiedPOST("events");
		switch (response.status) {
			case 200:
				const events = await response.json();
				if (session.current.active || events != null) {
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
				await backend.server();
				break;
		}
	},
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

const newChat = async function () {
	session.reset();
	session.current.connected = true;

	disconnectNode.set("stop");

	chatNode.clear();
	chatNode.add.status.default("Conneting to server...");

	if (settings.autoclearchat) {
		chatNode.typebox.value = "";
	}

	createChild("#videowrapper", { tag: "div", args: { className: "spinner" } });

	const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true } });
	videoNode.selfvideo.srcObject ??= media;
	videoNode.selfvideo.muted = true;
	videoNode.othervideo.srcObject = null;

	session.current.pc = video(media);

	const start = await backend.connect();
	eventHandler.parser(start.events);
	session.current.id = start.clientID;

	eventHandler.subscribe();
};

keyboard.init();
settingManager.load();
cmd.load();
backend.server();
