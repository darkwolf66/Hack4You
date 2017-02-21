var config  =  require('../config.js');
var microtime = require('microtime');

var UserlistCleaner = function() {
	var checkTask;
	var userlistCheck = function(){
		console.log('User cleaner started.. By UserlistCheck');
		for (var user of global.loggedUsers.values()) {
		  	if(microtime.now() > user.token_expiration){
				global.loggedUsers.delete(user.token);
			}
		}
	}
	this.startTask = function(){
		checkTask = setInterval(userlistCheck, config.tasks.userlist_check);
	}
}
module.exports = new UserlistCleaner();