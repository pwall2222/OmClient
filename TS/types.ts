interface backendEvent {
	name: string;
	data?: any;
}

interface domObject {
	tag: string;
	args?: args;
	child?: domObject;
}

interface command {
	name: string;
	alias: string[];
	description: string;
	exec: Function;
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

interface setting {
	autoskip: boolean;
	autoskip_delay: number;
	twiceskip: boolean;
	autodisconnect: boolean;
	autodisconnect_delay: number;
	autoclearchat: boolean;
	cmd_history: number;
	likes: string[];
	likes_enabled: boolean;
	lang: string;
	video: boolean;
	socials: {};
}

interface keyEvents {
	key: string;
	tag: string;
	conditions?: boolean;
	exec: Function;
}

type disconnectStatus = "stop" | "rlly" | "new";
type author = "you" | "stranger";
type pcOption = "Offer" | "Answer";
