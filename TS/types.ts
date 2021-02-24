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

type disconnectStatus = "stop" | "rlly" | "new";
type author = "you" | "stranger";
type pcOption = "Offer" | "Answer";
