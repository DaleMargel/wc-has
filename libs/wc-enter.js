// converts enter key to mouse click
// ... does not work in some situations.
// ... e.g when slotted can handle enter key
let tmpl = document.createElement('template');
tmpl.innerHTML = `<slot></slot>`;

class WcEnter extends HTMLElement {
	constructor() { super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tmpl.content.cloneNode(true));
	}
	connectedCallback(){
		const targ = this.shadowRoot.querySelector('slot').assignedNodes()[0];
		targ.addEventListener('keyup', e => this.click(e));
	}
	click(e){
		if(e.keyCode != 13) return;
		e.preventDefault();

		var evt = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
		const targ = this.shadowRoot.querySelector('slot').assignedNodes()[0];
		targ.dispatchEvent(evt);
	}
}
// export ("WcEnter");
try{ customElements.define("wc-enter",WcEnter) }
catch(NotSupportedError){/* duplicate */}
export { WcEnter }
