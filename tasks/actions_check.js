var config  =  require('../config.js');
var microtime = require('microtime');

var ActionsCheck = function() {
    var checkTask;
    var userlistCheck = function(){
        console.log('User cleaner started.. By ActionsCheck');
        for (var user of global.loggedUsers.values()) {
            if(user.minute_actions > config.expiration.minute_actions){
                global.loggedUsers.delete(user.token);
                console.log('User with token: '+user.token+' has been disconnected.. by ActionsCheck with reason: Max Minute Actions');
            }else{
                global.loggedUsers.get(user.token).minute_actions = 0;
            }
        }
    }
    this.startTask = function(){
        checkTask = setInterval(userlistCheck, config.tasks.actions_check);
    }
}
module.exports = new ActionsCheck();