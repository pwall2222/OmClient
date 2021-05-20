interface backendEvent {
	name: string;
	data?: any;
}

interface domObject {
	tag: string;
	args?: domObjectArguments;
	child?: domObject;
}

interface command {
	name: string;
	alias: string[];
	description: string;
	exec: () => void;
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
	/* [key: string]: unknown */
}

interface keyEvents {
	key: string;
	tag: string;
	prevent: boolean;
	exec: () => void;
}

type disconnectStatus = "stop" | "rlly" | "new";
type messageAuthor = "you" | "stranger";
type themes = "dark" | "light";
