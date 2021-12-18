interface domObject {
	tag: string;
	args?: domObjectArguments;
	child?: domObject;
}

interface domObjectArguments {
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
	value?: string;
	label?: string;
	selected?: boolean;
	text?: string;
	multiple?: boolean | "";
	/* [key: string]: unknown */
}

interface backendEvent {
	name: string;
	data?: any;
}

interface keyEvent {
	key: string;
	prevent: boolean;
	exec: () => void;
}

interface globalKey extends keyEvent {
	global: true;
}

interface tagKey extends keyEvent {
	tag: string;
}

type keyEvents = globalKey | tagKey;

interface keyBind {
	mode: number;
	code: string;
	command: string;
}

interface command {
	name: string;
	alias: string[];
	description: string;
	exec: () => void;
}

type disconnectStatus = "stop" | "rlly" | "new";
type messageAuthor = "you" | "stranger";
type themes = "dark" | "light";

type boolObj = { [key: string]: boolean };
