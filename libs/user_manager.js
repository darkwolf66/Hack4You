var config    = require('../config.js');
var microtime = require('microtime');
var lang = require('../lang.js');
var lang = new lang();
var rlang = lang.returnMessage;

var UserManager = function() {
	this.checkUserLogin = function(token, res, lang){
		var user = global.loggedUsers.get(token);
		if(user != undefined){
			if(res != undefined && global.loggedUsers.get(token).actions > config.expiration.actions){
				global.loggedUsers.delete(token);
				return false;
			}
			if(microtime.now() < user.token_expiration){
				global.loggedUsers.get(token).actions++;
				global.loggedUsers.get(token).minute_actions++;
				return true;
			}else if(user.minute_actions > config.expiration.minute_actions){
				global.loggedUsers.delete(token);
				return false;
			}else{
				global.loggedUsers.delete(token);
				return false;
			}
		}else{
			return false;
		}
	}
}

module.exports = UserManager;
