// ==UserScript==
// @name         Omegle-Tweaks
// @version      1.0
// @author       PWall
// @include      https://omegle.com/*
// @include      https://www.omegle.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
	document.head.textContent = "";
	let doc = await fetch("").then(response => response.text());
	document.write(doc);
})();