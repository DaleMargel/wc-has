// dispatch custom event compatible with wc-has
function dispatch(self,map){
	const opt = { bubbles: true, cancelable: true, detail:map }
	const evt = new CustomEvent('attributechanged', opt);
	self.dispatchEvent(evt);
}
export { dispatch }
// Code: Copyright © 2021 Dale Margel / Azure Solutions
// under Creative Commons - Attribution-NonCommercial CC BY-NC
// Build 2021.05.05
// Use at your own risk
