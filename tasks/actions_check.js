var lang = require('../lang.js');
var config  =  require('../config.js');
var fieldValidator = require('../libs/field_validator');
var microtime = require('microtime');
//Presets
var lang = new lang();
var rlang = lang.returnMessage;

module.exports = function(app, my){
    app.post('/api/query/machine/', function(req, res){
        if(!req.body.lang){
            return res.send({"status": "error", "code":1 ,"message": 'Blank Language'});
        }else{
            var lang = req.body.lang;
        }
        var rsp = global.userManager.checkUserLogin(req.body.token, res, lang);
        if(rsp == 'exit'){
            return false;
        }
        if(req.body.token && rsp){
        	if(){
        		
        	}
            my.query('SELECT * FROM 4h_machines WHERE id_user=?', global.loggedUsers.get(token).id_user, function (error, own_machine, fields) {
                if (error) {
                    console.log(error);
                    return res.send({"status": "error", "code":15 ,"message": rlang(lang, 15)});
                }else{
                    money = result[0].money;
                    return res.send({"status": "success", "balance": money});
                }
            });
        }else{
            return res.send({"status": "error", "code":16 ,"message": rlang(lang, 16)});
        }
    });

}

