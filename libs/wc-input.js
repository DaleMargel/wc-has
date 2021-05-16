let template = document.createElement('template');
template.innerHTML = `
<style>
	:host {
		display: inline;
		contain: content;
	}
	.hidden { display: none }
	input[span=narrow] { width:75px }
	input[span=normal] { width:150px }
	input[span=wide] { width:225px }
	input[span=extrawide] { width:300px }
	input.error { background-color:yellow }
	input.changed { background-color: lightgreen !important }
	input { border-radius: 2px;  border: 1px solid black}
	input:read-only { background-color: lightgray; border: 1px solid black}

	@media screen {
		input{ display: inline }
		span { display: none }
	}
	@media print {
		input{ display: none }
		span { display: inline }
	}
</style>
<span></span>
<input />
`;

class WcInput extends HTMLElement {
	constructor() { super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(template.content.cloneNode(true));
	}
	static get observedAttributes() { return ['has','value','pattern','title','span','min','max','fix'] }
	get target(){ return this.shadowRoot.querySelector('input') }
	get span(){ return this.shadowRoot.querySelector('span') }

	connectedCallback() {
		this.load(this.target,'min','max','minlength','placeholder','readonly','rel','target','type');
		this.target.addEventListener('input', e=>this.oninput(e));
		this.target.addEventListener('change',e=>this.onchange(e))
	}
	attributeChangedCallback(name, old, curr) {
		if(old === curr) return;
		this.data[name]=curr;
		this[`at${name}`](curr);
	}
	athas(value){}
	atvalue(value){ this.render(this.data.value) }
	atpattern(value){ this.render(this.data.value) }
	atitle(value){ this.target.setAttribute('title',value) }
	atspan(value){ this.target.setAttribute('span',value) }
	atmin(value){ this.data.min=parseFloat(value) }
	atmax(value){ this.data.max=parseFloat(value) }
	atfix(value){ this.data.fix=parseInt(value) }
	oninput(e){ this.validate(e.target.value) }
	onchange(e){
		// TODO: figure out why inner input does not propagate change value event
		// answer: change events are not composed so this is expected behavior.
		// good discussion here: https://github.com/Polymer/lit-element/issues/922
		let { value } = e.target;
		this.data.value=value;

		let map = {}
		let { has } = this.data;
		map[has]=value;
		this.event(map);
	}
	event(map){
		const opt = { bubbles: true, cancelable: true, detail:map }
		const evt = new CustomEvent('attributechanged', opt);
		this.dispatchEvent(evt);
	}
	data={};
	validate(value){
		let ok = x=>typeof x !== 'undefined';
		let { pattern, min, max } = this.data;
		let result = true;

		if(ok(value) && ok(pattern)){
			switch(pattern){
				case 'int': pattern=`[+-]?\\d+`; break;
				case '+int': pattern=`[+]?\\d+`; break;
				case '-int': pattern =`-\\d+`; break;
				case 'float': pattern = `[+-]?\\d+(\\.\\d*)?`; break;
				case '+float': pattern = `[+]?\\d+(\\.\\d*)?`; break;
				case '-float': pattern = `-\\d+(\\.\\d*)?`; break;
			}
			let regx = new RegExp(`^(${pattern})$`);
			result = regx.test(value);
		}
		let n = parseFloat(value);
		result &&= ok(n);
		result &&= (!ok(min) || n>=min);
		result &&= (!ok(max) || n<=max);

		if(result) this.target.classList.remove('error');
		else this.target.classList.add('error');
		return result;
	}
	format(value){
		if(value == 'undefined') return '';
		
		let ok = x=>typeof x !== 'undefined';
		let { fix }=this.data;

		if(ok(fix)){
			let f = parseFloat(value);
			if(fix<0){
				const exp=10**fix;
				value = (Math.round(f*exp)/exp).toFixed(0);
			}
			else {
				value = f.toFixed(fix);
			}
		}
		return value
	}
	render(value){
		this.validate(value);
		this.target.value=this.format(value);
		this.span.innerText=this.format(value);
		this.target.classList.add('changed');
		window.setTimeout(()=>this.target.classList.remove('changed'),500);
	}
	load(target,...names){
		for(let name of names){
			if(name == 'readonly' && this.getAttribute(name) == ''){
				target.readonly=true;
				target.setAttribute(name,'true');
			}
			else {
				let attr = this.getAttribute(name);
				if(attr) target.setAttribute(name,attr);
			}
		}
	}
}
try{ customElements.define("wc-input",WcInput) }
catch(NotSupportedError){/* duplicate */}
export { WcInput }
// Copyright © 2021 Dale Margel / Azure Solutions
// under Creative Commons - Attribution-NonCommercial CC BY-NC
// Build 2021.05.05
// Use at your own risk
