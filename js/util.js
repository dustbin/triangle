class Util {
	static getStyle(selector){
		let i,j,sheet;
		for(let i in document.styleSheets){
			sheet = document.styleSheets[i];
			for(let j in sheet.cssRules){
				if(sheet.cssRules[j].selectorText == selector){
					return sheet.cssRules[j].style;
				}
			}
		}
		return null;
	}
}
