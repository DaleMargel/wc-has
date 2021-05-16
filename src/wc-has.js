class WcHas extends HTMLElement {
	constructor(){ super();
		this.addEventListener('change',e=>{
			let haz = e.target.getAttribute("has");
			if(!haz) return;

			let valu = e.target.value;
			this.putAttribute(haz,valu,e.target);
			this.start(haz);
		});
		this.addEventListener('attributechanged',e=>{
			let data = e.detail;
			let keys = Object.keys(data);
			for(let haz of keys){
				let valu = data[haz];
				this.putAttribute(haz,valu,e.target);
				this.start(haz);
			}
		})
	}
	get calculations(){ return this.calc }
	set calculations(calc){
		// accept an object containing calculatons to be used for updates
		// TODO: explore use of reflection to read functions/args
		this.calc = calc;
		let names = Object.getOwnPropertyNames(Object.getPrototypeOf(calc));
		for(let name of names){
			if(name === 'constructor') continue;
			const prop = calc[name];
			if(typeof prop !== 'function') continue;
			const func = prop.toString();
			const args = func.match(/\((.*?)\)/)[1].split(',');
			this.map[name]=args;
			if(args[0]==''){
				let sett = calc[name]();
				this.putAttribute(name,sett,null);
			}
		}
	}
	map={}; // function / dependency map
	calc=false; // external calculations
	stak=[]; // pending calculations, so we dont eat our tail
	done=[]; // done calculations, so we don't repeat our work
	start(name){
		this.stak=[];
		this.done=[];
		this.changed(name);
	}
	// value has changed, update all values that depend on it
	changed(name){
		if(this.done.includes(name)) return;
		if(this.stak.includes(name)) return;
		this.stak.push(name);

		let depns = Object.keys(this.map).filter(x=>this.map[x].includes(name));
		for(let d of depns) {
			this.update(d); // update calculation dependency
			this.changed(d); // and its dependencies...
		}
		this.done.push(this.stak.pop());
	}
	// update calculated value of "name" due to a dependency change
	update(name){
		if(!this.calc) return;

		let args = [];
		let argnames = this.map[name];
		for(let arg of argnames){
			let tag = document.querySelector(`[has=${arg}]`);
			let value = tag.value ?? tag.data.value;

			//let value = document.querySelector(`[has=${arg}]`).value;
			if(typeof value === 'undefined') return;
			args.push(parseFloat(value));
		}
		const result = this.calc[name](...args);
		this.putAttribute(name,result,null);
	}
	// write value to all tags that "has" them
	putAttribute(haz,valu,ignore){
		let list = this.querySelectorAll(`[has~=${haz}]`);
		for(let item of list){ 
			if(item === ignore) continue;

			// element with visible attribute
			if(item.hasAttribute(haz)) { 
				if(valu != item.getAttribute(haz)) item.setAttribute(haz,valu);
				continue;
			}
			// web component with declared attribute
			if(item.constructor?.observedAttributes){
				let lchaz=haz.toLowerCase();
				if(item.constructor?.observedAttributes.includes(lchaz)){
					// wc uses attribute
					item.setAttribute(haz,valu);
					continue;
				}
				else{
					// wc uses a value instead of attribute
					item.setAttribute('value',valu);
					continue;
				}
			}
			// element that uses 'value'
			if(item.value != undefined){ 
				if(valu != item.value) item.value = valu;
				continue;	
			}
			// element with ONE text child
			if(item.childNodes?.length>0){ 
				let texts = [];
				for(let x of item.childNodes){ if(x.nodeType==3) texts.push(x) }
				if(texts.length == 1) { 
					texts[0].textContent = valu;
					continue;
				}
			}
		}
	}
}
try{ customElements.define("wc-has",WcHas) }
catch(NotSupportedError){/* duplicate */}

export { WcHas }
// Code: Copyright © 2021 Dale Margel / Azure Solutions
// under Creative Commons - Attribution-NonCommercial CC BY-NC
// Build 2021.05.05
// Use at your own risk
