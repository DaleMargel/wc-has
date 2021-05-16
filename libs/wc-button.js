let template = document.createElement('template');
template.innerHTML = `
<style>
:host {
	display: inline;
	contain: content;
}
[color=default]{ 
	background-color: transparent; color: black; 
	border-style: solid; border-width: 1px; border-color: black 
}
[color=blank]{ background-color: transparent; color:black }
[color=primary]{ background-color: dodgerblue; color:white }
[color=success]{ background-color:limegreen; color: white }
[color=info]{ background-color: grey; color:white }
[color=warning]{ background-color: orange; color: white }
[color=danger]{ background-color: red; color:white }
[size=small]{ font-size: .875rem }
[size=medium]{ font-size: 1rem }
[size=large]{ font-size: 1.2rem }
[size=huge]{ font-size: 2rem }
[trim=square]{ border-radius: 0 }
[trim=smooth]{ border-radius: 4px }
[trim=round]{ border-radius: 9999px }
[span=narrow]{ min-width: 50px }
[span=normal]{ min-width: 100px }
[span=wide]{ min-width:150px }
[span=extrawide] { min-width:300px }
[span=full]{ width: 100% }
[theme=dark][color=default]{ 
	background-color: transparent; color: white; 
	border-style: solid; border-width: 1px; border-color: white
}
[theme=dark][color=blank]{ background-color: transparent; color:white }

a { /* credit: tachyons */
	-moz-osx-font-smoothing: grayscale; 
	-webkit-backface-visibility: hidden; 
	backface-visibility: hidden; 
	-webkit-transform: translateZ( 0 ); transform: translateZ( 0 ); 
	transition: -webkit-transform .25s ease-out; 
	transition: transform .25s ease-out; 
	transition: transform .25s ease-out, -webkit-transform .25s ease-out;
	text-decoration: none;
	text-align: center;
	padding-left: 1rem; padding-right: 1rem;
	padding-top: .5rem; padding-bottom: .5rem;
	margin-bottom: .5rem;
	min-height:16px;
	display: inline-block;
	cursor:pointer;
}
a:hover, a:focus { -webkit-transform: scale( 1.05 ); transform: scale( 1.05 ); }
a:active { -webkit-transform: scale( .90 ); transform: scale( .90 ); }
</style>
<a color="primary" size="medium" trim="smooth" span="narrow" theme="light" role="button" href="javascript:void(0)">
	<slot></slot>
</a>`;

class WcButton extends HTMLElement {
	constructor() { super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(template.content.cloneNode(true));
	}
	static get observedAttributes() { return ['href','color','size','trim','span','theme'] }
	connectedCallback() {
		const target=this.shadowRoot.querySelector('a');
		this.load(target,'download','hreflang','media','ping','referrerpolicy','rel','target','type');
	}
	attributeChangedCallback(name, oldVal, newVal) {
		if(oldVal === newVal) return;

		let target = this.shadowRoot.querySelector('a');
		if(!oldVal){ this.dflts[name]=target.getAttribute(name) }
		if(newVal === '') newVal = this.dflts[name];
		target.setAttribute(name,newVal);
	}
	load(target,...names){
		for(let name of names){
			let attr = this.getAttribute(name);
			if(attr) target.setAttribute(name,attr);
		}
	}
	dflts = {};
}
try{ customElements.define("wc-button",WcButton) }
catch(NotSupportedError){/* duplicate */}
export { WcButton }
// Code: Copyright © 2021 Dale Margel / Azure Solutions
// under Creative Commons - Attribution-NonCommercial CC BY-NC
// Build 2021.05.05
// Use at your own risk

