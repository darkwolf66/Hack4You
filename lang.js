var lang = function(){
	var langs = new Array();
	//Add languages
	langs.push(new require('./languages/en.js'));
	
	this.returnMessage = function(lang, code) {
		for (language of langs){
			if(language.name == lang){
				for (message of language.messages){
					if(message.code == code){
						return message.message;
					}
				}
				return false;
			}
		}
		return false;
	}
}

module.exports = lang;