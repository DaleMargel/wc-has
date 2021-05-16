// a swatch of color used to demo wc-has
// not too useful otherwise

let tmpl = document.createElement('template');
tmpl.innerHTML = `
<style>
div {
	height: 32px;
	width: 32px;
	border-radius: 16px;
	background-color: white;
}
</style>
<div tabindex="0"/>`
class WcSwatch extends HTMLElement {
	constructor() { super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tmpl.content.cloneNode(true));
	}
	static get observedAttributes() { return ['color'] }

	connectedCallback(){
		this.addEventListener('click', e => this.toggle(e) );
	}
	attributeChangedCallback(name, oldVal, newVal) {
		if(oldVal === newVal) return;
		if(name ==='color'){
			const div = this.shadowRoot.querySelector('div');
			div.style.backgroundColor = newVal;
		}
	}
	toggle(e){
		const div = this.shadowRoot.querySelector('div');
		const color = div.style.backgroundColor == 'red' ? 'blue' : 'red';
		this.setAttribute('color',color);

		// hack: the color input control is picky about input format
		// so we must translate it as so we have to use attributechanged

		const ncolor = {red:'#ff0000',blue:'#0000ff'}[color];
		const event = new CustomEvent('attributechanged', { bubbles: true, cancelable: true, detail:{color:ncolor}} );
		this.dispatchEvent(event);
	}
}
try{ customElements.define("wc-swatch",WcSwatch) }
catch(NotSupportedError){/* duplicate */}
export { WcSwatch }
