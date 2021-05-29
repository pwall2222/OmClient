const createElement = (domObject: domObject) => {
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

const createChild = (parent: string, domObject: domObject) => {
	const child = createElement(domObject);
	document.querySelector(parent).appendChild(child);
	return child;
};

const createChildBefore = (parent: string, reference: string, domObject: domObject) => {
	const child = createElement(domObject);
	const parentNode = document.querySelector(parent);
	const referenceNode = parentNode.querySelector(reference);
	parentNode.insertBefore(child, referenceNode);
	return child;
};

const clearChilds = (nodeName: string) => {
	const node = document.querySelector(nodeName);
	node.textContent = "";
};

const clearAllElements = (nodeName: string) => {
	const nodes = document.querySelectorAll(nodeName);
	nodes.forEach((element: Element) => element.remove());
};

export { clearAllElements, clearChilds };
export { createElement, createChild, createChildBefore };
